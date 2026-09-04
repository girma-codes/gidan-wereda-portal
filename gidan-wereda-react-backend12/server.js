const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// የ MySQL ቆንክሽን (Connection) ማስተካከል
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // የ MySQL Username
  password: '',        // የ MySQL Password (ካለህ አስገባ፣ ከሌለ ባዶ ይሁን)
  database: 'gidan_wereda_db12'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL Database.');
});

// ==========================================================
// 1. የሎጊን API (Authentication & Role-Based Login)
// ==========================================================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    res.json({ 
      message: 'Login successful', 
      role: user.role, 
      username: user.username,
      pool_name: user.pool_name || null 
    });
  });
});

// ==========================================================
// 2. ማመልከቻዎች እና የትራኪንግ/አድሚን ራውቶች (Applications & Tracking)
// ==========================================================

app.post('/api/applications', (req, res) => {
  const { full_name, phone, service_type, description } = req.body;
  const tracking_code = 'GIDAN-' + Math.floor(100000 + Math.random() * 900000);
  
  const query = 'INSERT INTO applications (full_name, phone, service_type, description, tracking_code, status, messages) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [full_name, phone, service_type, description, tracking_code, 'Pending', '[]'], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ 
      message: 'Application submitted successfully!', 
      id: result.insertId,
      tracking_code: tracking_code 
    });
  });
});

app.get('/api/applications/track/:code', (req, res) => {
  const code = req.params.code;
  const query = 'SELECT * FROM applications WHERE tracking_code = ?';
  
  db.query(query, [code], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'ይህ Tracking Code ያለው ማመልከቻ አልተገኘም!' });
    }
    res.json(results[0]);
  });
});

app.get('/api/admin/applications', (req, res) => {
  const query = 'SELECT * FROM applications ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.put('/api/admin/applications/:id', (req, res) => {
  const { status, admin_reply, ict_key } = req.body;
  const appId = req.params.id;

  if (ict_key && ict_key !== 'gidan_ict_key_2026') {
    return res.status(403).json({ error: 'ፈቃድ የለዎትም!' });
  }

  const selectQuery = 'SELECT messages FROM applications WHERE id = ?';
  db.query(selectQuery, [appId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    let messages = [];
    try {
      messages = results[0]?.messages ? JSON.parse(results[0].messages) : [];
    } catch (e) {
      messages = [];
    }

    if (admin_reply && admin_reply.trim() !== '') {
      messages.push({
        sender: 'admin',
        text: admin_reply,
        timestamp: new Date().toISOString()
      });
    }

    const query = 'UPDATE applications SET status = ?, admin_reply = ?, messages = ? WHERE id = ?';
    db.query(query, [status, admin_reply, JSON.stringify(messages), appId], (updateErr) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'ማመልከቻው በተሳካ ሁኔታ ተዘምኗል!', messages });
    });
  });
});

app.post('/api/applications/:id/chat', (req, res) => {
  const appId = req.params.id;
  const { sender, text } = req.body;

  const selectQuery = 'SELECT messages FROM applications WHERE id = ?';
  db.query(selectQuery, [appId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'ማመልከቻው አልተገኘም' });
    }

    let messages = [];
    try {
      messages = results[0].messages ? JSON.parse(results[0].messages) : [];
    } catch (e) {
      messages = [];
    }

    messages.push({
      sender: sender,
      text: text,
      timestamp: new Date().toISOString()
    });

    const updateQuery = 'UPDATE applications SET messages = ? WHERE id = ?';
    db.query(updateQuery, [JSON.stringify(messages), appId], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: 'መልእክቱን ማስቀመጥ አልተቻለም' });
      }
      res.json({ message: 'መልእክቱ ተልኳል!', messages });
    });
  });
});

// ==========================================================
// 3. የኮንታክት መልእክቶች እና ቻት ራውቶች (Contact Routes & Live Chat)
// ==========================================================

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  const initialMessages = JSON.stringify([{
    sender: 'user',
    text: message,
    timestamp: new Date().toISOString()
  }]);

  const query = 'INSERT INTO contacts (name, email, message, messages) VALUES (?, ?, ?, ?)';

  db.query(query, [name, email, message, initialMessages], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Message sent successfully!', id: result.insertId });
  });
});

app.get('/api/admin/contacts', (req, res) => {
  const query = 'SELECT * FROM contacts ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/api/admin/contacts/:id/reply', (req, res) => {
  const contactId = req.params.id;
  const { text } = req.body;

  const selectQuery = 'SELECT messages FROM contacts WHERE id = ?';
  db.query(selectQuery, [contactId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'መልእክቱ አልተገኘም' });
    }

    let messages = [];
    try {
      messages = results[0].messages ? JSON.parse(results[0].messages) : [];
    } catch (e) {
      messages = [];
    }

    messages.push({
      sender: 'admin',
      text: text,
      timestamp: new Date().toISOString()
    });

    const updateQuery = 'UPDATE contacts SET messages = ? WHERE id = ?';
    db.query(updateQuery, [JSON.stringify(messages), contactId], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: 'መልእክቱን ማስቀመጥ አልተቻለም' });
      }
      res.json({ message: 'መልእክቱ በተሳካ ሁኔታ ተልኳል!', messages });
    });
  });
});

app.post('/api/contact/:id/chat', (req, res) => {
  const contactId = req.params.id;
  const { sender, text } = req.body;

  const selectQuery = 'SELECT messages FROM contacts WHERE id = ?';
  db.query(selectQuery, [contactId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'መልእክቱ አልተገኘም' });
    }

    let messages = [];
    try {
      messages = results[0].messages ? JSON.parse(results[0].messages) : [];
    } catch (e) {
      messages = [];
    }

    messages.push({
      sender: sender,
      text: text,
      timestamp: new Date().toISOString()
    });

    const updateQuery = 'UPDATE contacts SET messages = ? WHERE id = ?';
    db.query(updateQuery, [JSON.stringify(messages), contactId], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: 'መልእክቱን ማስቀመጥ አልተቻለም' });
      }
      res.json({ message: 'መልእክቱ ተልኳል!', messages });
    });
  });
});

// ==========================================================
// 4. የ ICT ባለሙያ ዜና ማስተዳደሪያ ራውቶች
// ==========================================================
app.get('/api/news', (req, res) => {
  const query = 'SELECT * FROM news ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/ict/news', (req, res) => {
  const { title, content, author, ict_key } = req.body;
  if (ict_key !== 'gidan_ict_key_2026') {
    return res.status(403).json({ error: 'ፈቃድ የለዎትም!' });
  }
  const query = 'INSERT INTO news (title, content, author, created_at) VALUES (?, ?, ?, NOW())';
  db.query(query, [title, content, author || 'የ ICT ባለሙያ'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'ዜናው በተሳካ ሁኔታ ተለጠፈ!', id: result.insertId });
  });
});

// ==========================================================
// 5. የሰራተኞች አስተዳደር ራውቶች (Staff Routes)
// ==========================================================
app.get('/api/staff', (req, res) => {
  const query = 'SELECT * FROM staff ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/admin/staff', (req, res) => {
  const { name, position, department, phone, status, ict_key } = req.body;
  if (ict_key !== 'gidan_ict_key_2026') return res.status(403).json({ error: 'ፈቃድ የለዎትም!' });
  const query = 'INSERT INTO staff (name, position, department, phone, status) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, position, department, phone, status || 'available'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'ሰራተኛው በተሳካ ሁኔታ ተመዝግቧል!', id: result.insertId });
  });
});

app.put('/api/admin/staff/:id', (req, res) => {
  const staffId = req.params.id;
  const { name, position, department, phone, status, ict_key } = req.body;

  if (ict_key && ict_key !== 'gidan_ict_key_2026') {
    return res.status(403).json({ error: 'ፈቃድ የለዎትም!' });
  }

  const query = 'UPDATE staff SET name = ?, position = ?, department = ?, phone = ?, status = ? WHERE id = ?';
  db.query(query, [name, position, department, phone, status || 'available', staffId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'የሰራተኛው መረጃ በተሳካ ሁኔታ ተሻሽሏል!' });
  });
});

app.delete('/api/admin/staff/:id', (req, res) => {
  const staffId = req.params.id;
  const { ict_key } = req.body;

  if (ict_key && ict_key !== 'gidan_ict_key_2026') {
    return res.status(403).json({ error: 'ፈቃድ የለዎትም!' });
  }

  const query = 'DELETE FROM staff WHERE id = ?';
  db.query(query, [staffId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'ሰራተኛው ከሰንጠረዡ ተሰርዟል!' });
  });
});

// ==========================================================
// 6. የሰራተኞች አቴንዳንስ እና የ 3 ፑል ተቆጣጣሪዎች ራውቶች (Pool Focal Routes)
// ==========================================================

const verifyPoolFocal = (req, res, next) => {
  const { role, pool_name, ict_key } = req.body.pool_name ? req.body : req.query;
  
  if (role === 'hr_officer' || ict_key === 'gidan_ict_key_2026') {
    req.userRole = 'hr_officer';
    return next(); 
  }
  
  const allowedPools = ['Communication Pool', 'Administration Pool', 'Civil Service Pool'];

  if (role === 'pool_focal' && allowedPools.includes(pool_name)) {
    req.userPool = pool_name; 
    req.userRole = 'pool_focal';
    return next();
  }

  return res.status(403).json({ error: 'ፈቃድ የለዎትም! እባክዎ ትክክለኛውን ፑል ይምረጡ።' });
};

app.post('/api/pool/attendance', verifyPoolFocal, (req, res) => {
  const { staff_id, attendance_date, status, recorded_by } = req.body;
  const pool_name = req.userPool || req.body.pool_name;

  if (!staff_id || !attendance_date || !pool_name) {
    return res.status(400).json({ error: 'እባክዎ ትክክለኛ መረጃ ይሙሉ!' });
  }

  const checkStaffQuery = 'SELECT * FROM staff WHERE id = ? AND department = ?';
  db.query(checkStaffQuery, [staff_id, pool_name], (checkErr, staffResults) => {
    if (checkErr || staffResults.length === 0) {
      return res.status(400).json({ error: 'ይህ ሰራተኛ በእርስዎ ፑል ስር አልተመዘገበም!' });
    }

    const insertQuery = 'INSERT INTO staff_attendance (staff_id, pool_name, attendance_date, status, recorded_by) VALUES (?, ?, ?, ?, ?)';
    
    db.query(insertQuery, [staff_id, pool_name, attendance_date, status || 'Present', recorded_by], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error: መረጃውን ማስቀመጥ አልተቻለም' });
      }
      res.status(201).json({ message: 'አቴንዳንሱ በተሳካ ሁኔታ ተመዝግቧል!', id: result.insertId });
    });
  });
});

app.get('/api/pool/attendance/:poolName', (req, res) => {
  const poolName = decodeURIComponent(req.params.poolName);
  
  const allowedPools = ['Communication Pool', 'Administration Pool', 'Civil Service Pool'];
  if (!allowedPools.includes(poolName)) {
    return res.status(403).json({ error: 'የማይታወቅ ፑል ስም!' });
  }

  const query = 'SELECT sa.*, s.name as staff_name, s.department FROM staff_attendance sa JOIN staff s ON sa.staff_id = s.id WHERE sa.pool_name = ? ORDER BY sa.attendance_date DESC';
  
  db.query(query, [poolName], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/hr/attendance/all', (req, res) => {
  const query = 'SELECT sa.*, s.name as staff_name, s.department FROM staff_attendance sa JOIN staff s ON sa.staff_id = s.id ORDER BY sa.attendance_date DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.put('/api/hr/attendance/approve/:id', (req, res) => {
  const attendanceId = req.params.id;
  const { approval_status, ict_key } = req.body; 

  if (ict_key && ict_key !== 'gidan_ict_key_2026') {
    return res.status(403).json({ error: 'ፈቃድ የለዎትም!' });
  }

  const query = 'UPDATE staff_attendance SET approval_status = ? WHERE id = ?';
  db.query(query, [approval_status || 'Approved', attendanceId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error: ማረጋገጥ አልተቻለም' });
    }
    res.json({ message: 'አቴንዳንሱ በተሳካ ሁኔታ ጸድቋል (Approved)!' });
  });
});

// ==========================================================
// 7. የፎካል ሪፖርት ማስተላለፊያ እና መቀበያ ራውቶች (Supervisor Reports)
// ==========================================================

app.post('/api/focal/send-official-report', (req, res) => {
  let { focal_name, report_title, report_month, report_content, report_type, pool_name, attendance_data } = req.body;

  if (!focal_name) focal_name = 'Communication Pool Focal (Comm Focal)';
  if (!pool_name) pool_name = 'Communication Pool';
  if (!report_type) report_type = 'weekly';

  const lowerType = String(report_type).toLowerCase();
  if (lowerType.includes('ሳምንት') || lowerType.includes('weekly')) {
    report_type = 'weekly';
  } else if (lowerType.includes('ወር') || lowerType.includes('monthly')) {
    report_type = 'monthly';
  } else if (lowerType.includes('ዓመት') || lowerType.includes('yearly')) {
    report_type = 'yearly';
  }

  const attendanceJsonString = attendance_data ? JSON.stringify(attendance_data) : null;

  const query = `
    INSERT INTO supervisor_reports 
    (focal_name, report_title, report_month, report_content, report_type, pool_name, attendance_data, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  
  db.query(query, [
    focal_name.trim(), 
    report_title || 'የአቴንዳንስ ሪፖርት', 
    report_month || 'May', 
    report_content || 'ሳምንታዊ ሪፖርት', 
    report_type, 
    pool_name, 
    attendanceJsonString
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error: ሪፖርቱን ማስቀመጥ አልተቻለም' });
    }
    res.status(201).json({ message: 'ሪፖርቱ በተሳካ ሁኔታ ለሱፐርቫይዘር ተልኳል!', id: result.insertId });
  });
});

app.get('/api/admin/supervisor-reports', (req, res) => {
  const query = 'SELECT * FROM supervisor_reports ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    const formattedResults = results.map(row => {
      let parsedAttendance = [];
      try {
        parsedAttendance = row.attendance_data ? JSON.parse(row.attendance_data) : [];
      } catch (e) {
        parsedAttendance = row.attendance_data;
      }

      return {
        ...row,
        attendance_data: parsedAttendance
      };
    });

    res.json(formattedResults);
  });
});

// ==========================================================
// 8. የሱፐርቫይዘር እና ፎካል ቻት API ዎች (ተስተካክሏል - ቻቶች እንዳይደባለቁ)
// ==========================================================

app.post('/api/chat/send', async (req, res) => {
  let { focal_name, sender_type, message } = req.body;
  
  if (!focal_name || !sender_type || !message) {
    return res.status(400).json({ error: 'እባክዎ የተሟላ መረጃ ይላኩ!' });
  }

  focal_name = focal_name.trim();

  const query = 'INSERT INTO focal_supervisor_chats (focal_name, sender_type, message, created_at) VALUES (?, ?, ?, NOW())';
  db.query(query, [focal_name, sender_type, message], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error: መልእክቱን ማስቀመጥ አልተቻለም' });
    }
    res.status(201).json({ success: true, message: 'መልእክቱ በተሳካ ሁኔታ ተልኳል!', id: result.insertId });
  });
});

app.get('/api/chat/:focal_name', async (req, res) => {
  const focal_name = decodeURIComponent(req.params.focal_name).trim();
  
  // የተመረጠውን ፎካል ብቻ በትክክል እንዲያመጣ ከሌሎች ፎካሎች ጋር እንዳይደባለቅ ተደረገ
  const query = `
    SELECT * FROM focal_supervisor_chats 
    WHERE TRIM(focal_name) = ? 
       OR TRIM(focal_name) = ?
    ORDER BY created_at ASC
  `;
  
  let altName = focal_name;
  if (focal_name.includes('Civil')) altName = 'Civil Service Pool Focal (Civil Focal)';
  else if (focal_name.includes('Comm')) altName = 'Communication Pool Focal (Comm Focal)';
  else if (focal_name.includes('Admin')) altName = 'Administration Pool Focal (Admin Focal)';

  db.query(query, [focal_name, altName], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// ==========================================================
// 9. ለ YearlyAttendance.jsx እና Chat Modal በቀጥታ የሚረዱ ራውቶች
// ==========================================================

app.get('/api/focal/chat', (req, res) => {
  const query = 'SELECT focal_name as sender, message as text, created_at FROM focal_supervisor_chats ORDER BY created_at ASC';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    const formattedMessages = results.map(row => ({
      sender: row.sender || 'Communication Pool Focal',
      text: row.text,
      time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    res.json(formattedMessages);
  });
});

app.post('/api/focal/chat', (req, res) => {
  const sender = req.body.sender || req.body.focal_name || 'Communication Pool Focal';
  const text = req.body.text || req.body.message;
  const sender_type = req.body.sender_type || 'focal';

  if (!text) {
    return res.status(400).json({ error: 'እባክዎ የሚላክ መልእክት ይጻፉ!' });
  }

  const query = 'INSERT INTO focal_supervisor_chats (focal_name, sender_type, message, created_at) VALUES (?, ?, ?, NOW())';
  db.query(query, [sender, sender_type, text], (err, result) => {
    if (err) {
      console.error('Database Insert Error:', err);
      return res.status(500).json({ error: 'Database error: መልእክቱን ማስቀመጥ አልተቻለም' });
    }
    res.status(201).json({ 
      success: true, 
      message: 'መልእክቱ ተቀምጧል', 
      id: result.insertId,
      text: text,
      sender: sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});