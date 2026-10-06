# Student Search Portal

A simple web app for searching students from a spreadsheet or sample data.

## Features
- Search by name, ID, email, phone, program, or department
- Filter by department, year, and enrollment status
- Upload a CSV or Excel file and search records instantly
- Responsive layout for desktop and mobile

## Run locally
1. Open a terminal in this folder.
2. Start a local web server:

```bash
python -m http.server 8000
```

3. Open your browser to:

```text
http://localhost:8000
```

## Notes
- If no file is uploaded, the app uses built-in sample student records.
- Excel column names can be similar to: `student_id`, `name`, `email`, `phone`, `department`, `program`, `year`, `status`, and `gpa`.

## Upload format
You can upload:
- `.csv`
- `.xlsx`
- `.xls`

The app will read the first worksheet and convert rows into searchable student records.
