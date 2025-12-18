// Quick structure test - run with: node test-structure.js
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/frontend/config/supabase.js',
  'src/frontend/services/adminService.js',
  'src/frontend/context/AdminAuthContext.jsx',
  'src/frontend/components/ProtectedRoute.jsx',
  'src/frontend/views/adminview/app2.js',
  'src/frontend/views/adminview/components/AdminLogin.jsx',
  'src/frontend/views/adminview/components/adminprofile/adminprofile.jsx',
  'src/backend/config/supabase_config.py',
  'src/backend/utils/password_utils.py',
  'src/backend/controllers/admin.py',
  'src/backend/scripts/init_admin.py',
];

console.log('Checking project structure...\n');

let allGood = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allGood = false;
  }
});

if (allGood) {
  console.log('\n✅ All required files are present!');
  console.log('\nNext steps:');
  console.log('1. Update Supabase schema (see QUICK_START.md)');
  console.log('2. Run: cd src/backend && python scripts/init_admin.py');
  console.log('3. Start backend: cd src/backend && python app.py');
  console.log('4. Start frontend: npm start');
} else {
  console.log('\n❌ Some files are missing. Please check the structure.');
}

