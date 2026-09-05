const SHEET_ID = '10ibvfLk6gYnY0CAWk58JqAGGBxFjREqwVsqZTVZkJqg';
const CACHE_KEY = 'net_zero_students_v3_cache';
const CACHE_TIME_KEY = 'net_zero_students_v3_cache_time';

export function getCachedStudents() {
  try {
    // Purge old legacy cache versions if present
    localStorage.removeItem('net_zero_students_cache');
    localStorage.removeItem('net_zero_students_cache_time');
    localStorage.removeItem('net_zero_students_v2_cache');
    
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
    // Fetch only Sheet: สำเนาของ 3 (gid: 848175127) and สำเนาของ 4 (gid: 471660602)
    const [raw3, raw4] = await Promise.all([
      fetchTabCsv('848175127'), // สำเนาของ 3
      fetchTabCsv('471660602')  // สำเนาของ 4
    ]);

    const rows3 = parseCsv(raw3);
    const rows4 = parseCsv(raw4);

    const studentMap = new Map();

    const processRow = (r, batchLabel, regDate) => {
      let id = '';
      let fullName = '';
      let faculty = '';
      let hours = 0;
      let isAttended = false;

      // Col 0 = No, Col 1 = Student ID, Col 2 = Name, Col 3 = Faculty, Col 4 = Hours, Col 5 = Status (Checkbox TRUE/FALSE)
      const idFromCol1 = r[1]?.replace(/\D/g, '');
      const idFromCol2 = r[2]?.replace(/\D/g, '');

      if (idFromCol1 && idFromCol1.length === 8) {
        id = idFromCol1;
        fullName = r[2] || '';
        faculty = r[3] || '';
        hours = parseFloat(r[4]) || 0;
        isAttended = String(r[5] || '').toUpperCase().includes('TRUE');
      } else if (idFromCol2 && idFromCol2.length === 8) {
        id = idFromCol2;
        fullName = r[3] || '';
        faculty = r[4] || '';
        hours = parseFloat(r[5]) || 0;
        isAttended = String(r[0] || r[6] || '').toUpperCase().includes('TRUE');
      } else {
        return;
      }

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
          major: '',
          year,
          submissions: [],
          dates: new Set()
        });
      }

      const st = studentMap.get(id);
      if (fullName.length > st.fullName.length) {
        st.fullName = fullName;
      }
      if (!st.faculty && faculty) {
        st.faculty = faculty;
      }
      st.dates.add(regDate);
      st.submissions.push({
        batch: batchLabel,
        regDate: regDate,
        hours: hours,
        totalHours: hours + ' ชม.',
        attended: isAttended,
        attendedText: isAttended ? 'เข้าร่วมกิจกรรม' : 'ไม่ได้เข้าร่วมกิจกรรม',
        details: `บันทึกชั่วโมงจิตอาสา Net-Zero (${batchLabel})`
      });
    };

    rows3.forEach(r => processRow(r, 'รอบวันที่ 3 ก.ย.', 'วันที่ 3'));
    rows4.forEach(r => processRow(r, 'รอบวันที่ 4 ก.ย.', 'วันที่ 4'));

    const students = Array.from(studentMap.values()).map(s => {
      const rawTotalHours = Math.round(s.submissions.reduce((acc, sub) => acc + sub.hours, 0) * 10) / 10;
      const isAttended = s.submissions.some(sub => sub.attended);
      const isApproved = isAttended && rawTotalHours > 0;
      const regDateText = s.dates.size > 1 ? 'วันที่ 3 และ 4' : [...s.dates][0];

      return {
        id: s.id,
        fullName: s.fullName,
        faculty: s.faculty,
        major: s.major,
        year: s.year,
        isAttended: isAttended,
        attendanceStatus: isAttended ? 'ATTENDED' : 'NOT_ATTENDED',
        attendanceText: isAttended ? 'เข้าร่วมกิจกรรม' : 'ไม่ได้เข้าร่วมกิจกรรม',
        attendanceColor: isAttended ? 'emerald' : 'rose',
        status: isApproved ? 'APPROVED' : (!isAttended ? 'NOT_ATTENDED' : 'PENDING'),
        statusText: isApproved 
          ? 'ผ่านการอนุมัติชั่วโมงจิตอาสา' 
          : (!isAttended ? 'ไม่ได้เข้าร่วมกิจกรรม' : 'ยังไม่ถึงเกณฑ์ / รอตรวจสอบ'),
        badgeColor: isApproved ? 'emerald' : (!isAttended ? 'rose' : 'amber'),
        totalHours: rawTotalHours,
        totalHoursNumeric: rawTotalHours,
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
