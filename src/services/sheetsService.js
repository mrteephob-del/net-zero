const SHEET_ID = '10ibvfLk6gYnY0CAWk58JqAGGBxFjREqwVsqZTVZkJqg';
const CACHE_KEY = 'net_zero_students_cache';
const CACHE_TIME_KEY = 'net_zero_students_cache_time';

export function getCachedStudents() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    // ignore
  }
  return [];
}

function parseCsv(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  return lines.slice(1).map(line => {
    const row = [];
    let inQuotes = false;
    let cell = '';
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push(cell.trim());
        cell = '';
      } else {
        cell += c;
      }
    }
    row.push(cell.trim());
    return row;
  }).filter(row => row.length > 1 && row[1] && row[1] !== 'รหัสนิสิต');
}

async function fetchTabCsv(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}&_t=${Date.now()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch gid ${gid}: status ${response.status}`);
  }
  return await response.text();
}

export async function fetchStudentsFromSheets() {
  try {
    // Parallel fetch: Day 3 summary (848175127), Day 4 summary (471660602), Day 3 details (0), Day 4 details (861575028)
    const [raw3, raw4, det3, det4] = await Promise.all([
      fetchTabCsv('848175127'),
      fetchTabCsv('471660602'),
      fetchTabCsv('0'),
      fetchTabCsv('861575028')
    ]);

    const rows3 = parseCsv(raw3);
    const rows4 = parseCsv(raw4);
    const detailRows3 = parseCsv(det3);
    const detailRows4 = parseCsv(det4);

    // Map student ID to major/details
    const detailMap = new Map();
    [...detailRows3, ...detailRows4].forEach(r => {
      const id = r[1]?.replace(/\D/g, '');
      const major = r[4]; // 7. สาขา
      if (id && major && major.length > 1) {
        detailMap.set(id, {
          major: major,
          bottleSmall: r[6] || '-',
          bottleLarge: r[8] || '-',
          cans: r[10] || '-',
          glassSmall: r[12] || '-',
          glassLarge: r[14] || '-',
          paper: r[16] || '-',
          clothes: r[18] || '-'
        });
      }
    });

    const studentMap = new Map();

    const processRow = (r, batchLabel, regDate) => {
      const id = r[1]?.replace(/\D/g, '');
      if (!id || id.length !== 8) return;

      const fullName = r[2] || '';
      const faculty = r[3] || '';
      const hours = parseFloat(r[4]) || 0;
      const detailInfo = detailMap.get(id);

      if (!studentMap.has(id)) {
        const prefix = id.slice(0, 2);
        let year = 'ปี 1';
        if (prefix === '66') year = 'ปี 4';
        else if (prefix === '67') year = 'ปี 3';
        else if (prefix === '68') year = 'ปี 2';
        else if (prefix === '69') year = 'ปี 1';

        studentMap.set(id, {
          id,
          fullName,
          faculty,
          major: detailInfo?.major || '',
          year,
          submissions: [],
          dates: new Set()
        });
      }

      const st = studentMap.get(id);
      if (fullName.length > st.fullName.length) {
        st.fullName = fullName;
      }
      if (!st.major && detailInfo?.major) {
        st.major = detailInfo.major;
      }
      st.dates.add(regDate);
      st.submissions.push({
        batch: batchLabel,
        regDate: regDate,
        hours: hours,
        totalHours: hours + ' ชม.',
        details: 'บันทึกชั่วโมงจิตอาสา Net-Zero',
        bottleSmall: detailInfo?.bottleSmall,
        bottleLarge: detailInfo?.bottleLarge,
        cans: detailInfo?.cans
      });
    };

    rows3.forEach(r => processRow(r, 'รอบวันที่ 3 ก.ย.', 'วันที่ 3'));
    rows4.forEach(r => processRow(r, 'รอบวันที่ 4 ก.ย.', 'วันที่ 4'));

    const students = Array.from(studentMap.values()).map(s => {
      const totalHours = Math.round(s.submissions.reduce((acc, sub) => acc + sub.hours, 0) * 10) / 10;
      const isApproved = totalHours > 0;
      const regDateText = s.dates.size > 1 ? 'วันที่ 3 และ 4' : [...s.dates][0];

      return {
        id: s.id,
        fullName: s.fullName,
        faculty: s.faculty,
        major: s.major,
        year: s.year,
        status: isApproved ? 'APPROVED' : 'PENDING',
        statusText: isApproved ? 'ผ่านการอนุมัติชั่วโมงจิตอาสา' : 'ยังไม่ถึงเกณฑ์ / รอตรวจสอบ',
        badgeColor: isApproved ? 'emerald' : 'amber',
        totalHours: totalHours,
        totalHoursNumeric: totalHours,
        regDateText: regDateText,
        submissions: s.submissions,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`
      };
    });

    students.sort((a, b) => a.id.localeCompare(b.id));

    // Save to local cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(students));
      localStorage.setItem(CACHE_TIME_KEY, new Date().toISOString());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    return {
      students,
      isLive: true,
      lastUpdated: new Date()
    };
  } catch (err) {
    console.error('Failed to fetch from Google Sheets:', err);
    // Try fallback from localStorage
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      if (cached) {
        return {
          students: JSON.parse(cached),
          isLive: false,
          isCached: true,
          lastUpdated: cachedTime ? new Date(cachedTime) : null
        };
      }
    } catch (e) {
      // ignore
    }

    // Default fallback to empty array if no cache
    return {
      students: [],
      isLive: false,
      isFallback: true,
      lastUpdated: null
    };
  }
}
