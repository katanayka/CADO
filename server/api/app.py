import os
import json
from flask import Flask, jsonify, request
from urllib.parse import unquote
import sqlite3

import numpy as np

app = Flask(__name__)

PROGRESS_FILE_PATH = "progress_data.json"
DISCIPLINE_FILE_PATH = "discipline_data.json"

def open_json(DATA_FILE_PATH):
    try:
        with open(DATA_FILE_PATH, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
    except FileNotFoundError:
        # If the file doesn't exist, create it
        data = {}
        save_json(data, DATA_FILE_PATH)

    return data

def save_json(data, DATA_FILE_PATH):
    with open(DATA_FILE_PATH, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False)
        
def get_node_data_from_tree(node, node_id):
    if node.get("id") == node_id:
        return node
    for child in node.get("children", []):
        result = get_node_data_from_tree(child, node_id)
        if result:
            return result
    return None

@app.route("/api/discipline/data", methods=["GET"])
def get_data():
    discipline = request.args.get("discipline", type=str)
    json_file = open_json(DISCIPLINE_FILE_PATH)
    discipline_dict = json_file.get(discipline, {})
    return discipline_dict

@app.route('/api/discipline/save', methods=['POST'])
def save_data():
    data = request.get_json()
    discipline_id = unquote(data.get("disciplineId", 0))
    print(discipline_id)
    json_file = open_json(DISCIPLINE_FILE_PATH)
    json_file[discipline_id] = data
    save_json(json_file,DISCIPLINE_FILE_PATH)
    return {'message': 'Data saved successfully', 'data': data}, 200

@app.route('/api/discipline/data/node', methods=['GET'])
def get_node_data():
    """Provide discipline id and node id to get node data from json file"""
    discipline_id = request.args.get("disciplineId", type=str)
    json_file = open_json(DISCIPLINE_FILE_PATH)
    discipline_data = json_file.get(discipline_id, {}).get("dataTree", {}).get("trees", [])
    node_data = {}
    for tree in discipline_data:
        root = tree.get("root")
        # Recursively search for the node with the given id
        node_data = get_node_data_from_tree(root, request.args.get("nodeId", type=str))
        
    print(node_data)
    if not node_data:
        return {'message': 'Node data not found'}, 404
    return {'message': 'Node data retrieved successfully', 'data': node_data}, 200

@app.route('/api/discipline/data/node/save', methods=['POST'])
def save_node_data():
    """Provide discipline id and node id to save node data to json file"""
    data = request.get_json()
    discipline_id = unquote(data.get("disciplineId", 0))
    json_file = open_json(DISCIPLINE_FILE_PATH)
    discipline_data = json_file.get(discipline_id, {}).get("dataTree", {}).get("trees", [])
    node_data = data.get("nodeData", {})
    print(node_data)
    for tree in discipline_data:
        root = tree.get("root")
        # Recursively search for the node with the given id
        node_data = get_node_data_from_tree(root, node_data.get("data").get("id"))
        if node_data:
            print("NODE DATA:",node_data)
            node_data.update(data.get("nodeData", {}))
            break
    save_json(json_file,DISCIPLINE_FILE_PATH)
    return {'message': 'Node data saved successfully', 'data': data}, 200



@app.route('/api/discipline/progress', methods=['GET'])
def get_progress():
    discipline_id = request.args.get("discipline", type=str)
    user_id = request.args.get("userId", type=str)
    json_file = open_json(PROGRESS_FILE_PATH)
    # Get discipline 
    discipline_progress = json_file.get(discipline_id, {})
    # Get user progress
    user_progress = discipline_progress.get(user_id, {})
    
    return {'message': 'Progress retrieved successfully', 'data': user_progress}, 200

@app.route('/api/discipline/progress/save', methods=['POST'])
def save_progress():
    data = request.get_json()
    print(data) # {'discipline_id': '%D0%9E%D0%9F%D0%B8%D0%90', 'node_id': 'Должен знать что такое абоба', 'user_id': '123', 'checked': False}
    discipline_id = unquote(data.get("discipline_id", ''))
    node_id = unquote(data.get("node_id", ''))
    question_text = unquote(data.get("questionText", ''))
    user_id = unquote(data.get("user_id", ''))
    checked = data.get("checked", False)
    json_file = open_json(PROGRESS_FILE_PATH)

    # Create discipline if it doesn't exist
    if discipline_id not in json_file:
        json_file[discipline_id] = {}
    # Create user if it doesn't exist
    if user_id not in json_file[discipline_id]:
        json_file[discipline_id][user_id] = {}
    # Create node if it doesn't exist
    if node_id not in json_file[discipline_id][user_id]:
        json_file[discipline_id][user_id][node_id] = {}
    # Create question if it doesn't exist
    if question_text not in json_file[discipline_id][user_id][node_id]:
        json_file[discipline_id][user_id][node_id][question_text] = {}
    # Save progress
    json_file[discipline_id][user_id][node_id][question_text] = checked

    save_json(json_file,PROGRESS_FILE_PATH)
    return {'message': 'Progress saved successfully', 'data': data}, 200

users = []

DATABASE_FILE = 'students.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def login(user_id, password):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (user_id, password))
    user = cursor.fetchone()

    conn.close()

    if user:
        return {'message': 'Login successful!', 'userType': user['role']}, 200
    else:
        return {'message': 'Invalid credentials'}, 401

@app.route('/api/login', methods=['POST'])
def login_route():
    data = request.get_json()
    user_id = data.get('userId')
    password = data.get('password')

    response, status_code = login(user_id, password)
    
    return response, status_code

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    user_id = data.get('userId')
    password = data.get('password')

    # Проверяем, существует ли уже пользователь с таким user_id
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
    existing_user = cursor.fetchone()

    # Если пользователь существует, возвращаем сообщение об ошибке
    if existing_user:
        conn.close()
        return 'User already exists', 400

    # Определяем роль пользователя на основе его user_id
    if re.match(r'^stud', user_id):
        role = 0
    else:
        role = 1

    # Регистрируем нового пользователя
    cursor.execute("INSERT INTO users (name, role, password) VALUES (?, ?, ?)", (user_id, role, password))
    conn.commit()
    conn.close()

    return 'User registered successfully!', 201

@app.route('/api/getMarks', methods=['GET'])
def get_marks():
    username = request.args.get('username')
    if not username:
        return {'message': 'Username is required'}, 400
    
    # Получите идентификатор пользователя и тип пользователя из базы данных по имени пользователя
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, role FROM users WHERE username = ?", (username,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'User not found'}, 404
    
    user_id, user_type = result
    
    if user_type == 'teacher':
        # Если пользователь - учитель, верните оценки каждого студента
        cursor.execute("""
            SELECT users.username, grades.grade, grades.pair, subjects.name 
            FROM grades 
            JOIN subjects ON grades.subject_id = subjects.id 
            JOIN users ON grades.user_id = users.id
            WHERE users.role = 'student'
        """)
        marks = cursor.fetchall()
        conn.close()
        
        data = [{'username': mark[0], 'grade': mark[1], 'pair': mark[2], 'subject_name': mark[3]} for mark in marks]

        return jsonify({'message': 'Student marks retrieved successfully', 'data': data}), 200
    else:
        # Если пользователь - студент, получите его оценки из базы данных
        cursor.execute("""
            SELECT grades.grade, grades.pair, subjects.name 
            FROM grades 
            JOIN subjects ON grades.subject_id = subjects.id 
            WHERE grades.user_id = ?
        """, (user_id,))
        marks = cursor.fetchall()
        conn.close()
        
        data = [{'grade': mark[0], 'pair': mark[1], 'subject_name': mark[2]} for mark in marks]
        return jsonify({'message': 'Marks retrieved successfully', 'data': data}), 200



@app.route('/api/getGroupMarks', methods=['GET'])
def get_group_marks():
    username = request.args.get('username')
    subject_name = request.args.get('subject_name')

    if not username or not subject_name:
        return {'message': 'Username and subject name are required'}, 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get user_id from database by username
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'User not found'}, 404

    user_id = result[0]

    # Get group_id from database by user_id
    cursor.execute("SELECT group_id FROM user_groups WHERE user_id = ?", (user_id,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'Group not found for user'}, 404

    group_id = result[0]

    # Get subject_id from database by subject name
    cursor.execute("SELECT id FROM subjects WHERE name = ?", (subject_name,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'Subject not found'}, 404

    subject_id = result[0]

    # Get all marks from database for the group and subject
    cursor.execute("""
        SELECT grades.grade, grades.pair 
        FROM grades 
        JOIN user_groups ON grades.user_id = user_groups.user_id
        WHERE user_groups.group_id = ? AND grades.subject_id = ?
    """, (group_id, subject_id))
    marks = cursor.fetchall()
    conn.close()

    # Calculate average marks per pair
    marks_by_pair = {}
    for grade, pair in marks:
        if pair not in marks_by_pair:
            marks_by_pair[pair] = []
        marks_by_pair[pair].append(grade)
    
    average_marks = [{'grade': sum(grades) / len(grades), 'pair': pair, 'subject_name': subject_name} 
                     for pair, grades in marks_by_pair.items()]

    return jsonify({'message': 'Group marks retrieved successfully', 'data': average_marks}), 200

# Add this function to your Flask application
@app.route('/api/getGroupStudentTotalMarks', methods=['GET'])
def get_group_student_total_marks():
    username = request.args.get('username')
    subject_name = request.args.get('subject_name')

    if not username or not subject_name:
        return {'message': 'Username and subject name are required'}, 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get user_id from database by username
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'User not found'}, 404

    user_id = result[0]

    # Get group_id from database by user_id
    cursor.execute("SELECT group_id FROM user_groups WHERE user_id = ?", (user_id,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'Group not found for user'}, 404

    group_id = result[0]

    # Get subject_id from database by subject name
    cursor.execute("SELECT id FROM subjects WHERE name = ?", (subject_name,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'Subject not found'}, 404

    subject_id = result[0]

    # Get all marks from database for the group and subject
    cursor.execute("""
        SELECT SUM(grades.grade) as total_marks
        FROM grades 
        JOIN users ON grades.user_id = users.id
        JOIN user_groups ON users.id = user_groups.user_id
        WHERE user_groups.group_id = ? AND grades.subject_id = ?
        GROUP BY users.username
    """, (group_id, subject_id))
    marks = cursor.fetchall()
    conn.close()
    total_marks_average = np.mean(marks)
    print(total_marks_average)

    return jsonify({'message': 'Total marks for each student in group retrieved successfully', 'data': total_marks_average}), 200

@app.route('/api/getCumulativeGroupMarks', methods=['GET'])
def get_cumulative_marks_for_group():
    # Get group_id from database by user_id

    username = request.args.get('username')
    subject_name = request.args.get('subject_name')
    
    if not username or not subject_name:
        return {'message': 'Username and subject name are required'}, 400
    
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get user_id from database by username
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'User not found'}, 404

    user_id = result[0]

    # Get group_id from database by user_id
    cursor.execute("SELECT group_id FROM user_groups WHERE user_id = ?", (user_id,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'Group not found for user'}, 404

    group_id = result[0]

    # Get subject_id from database by subject name
    cursor.execute("SELECT id FROM subjects WHERE name = ?", (subject_name,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'Subject not found'}, 404

    subject_id = result[0]

    # Get all marks for students in the specified group
    cursor.execute("""
        SELECT users.username, grades.grade
        FROM grades
        JOIN users ON grades.user_id = users.id
        JOIN user_groups ON users.id = user_groups.user_id
        WHERE user_groups.group_id = ? AND grades.subject_id = ?
        ORDER BY users.username, grades.id
    """, (group_id,subject_id))
    result = cursor.fetchall()
    conn.close()

    if not result:
        return {'message': 'No marks found for the specified group'}, 404

    # Organize the marks by student
    student_marks = {}
    for username, grade in result:
        if username not in student_marks:
            student_marks[username] = []
        student_marks[username].append(grade)

    # Find the maximum number of marks any student has
    max_marks_len = max(len(marks) for marks in student_marks.values())

    # Pad the marks arrays with zeros to the maximum length
    for username in student_marks:
        student_marks[username] += [0] * (max_marks_len - len(student_marks[username]))

    # Calculate cumulative marks for each student
    cumulative_marks = {username: np.cumsum(marks) for username, marks in student_marks.items()}

    # Calculate the average cumulative marks across all students
    all_cumulative_marks = np.array(list(cumulative_marks.values()))
    average_cumulative_marks = np.mean(all_cumulative_marks, axis=0)

    return jsonify({'message': 'Cumulative marks for the group retrieved successfully', 'data': average_cumulative_marks.tolist()}), 200

@app.route('/api/getAllStudentMarks', methods=['GET'])
def get_all_student_marks():
    username = request.args.get('username')
    subject_name = request.args.get('subject_name')

    if not username or not subject_name:
        return {'message': 'Username and subject name are required'}, 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get user_id from database by username
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'User not found'}, 404

    user_id = result[0]

    # Check if user is a teacher
    cursor.execute("SELECT user_type FROM users WHERE id = ?", (user_id,))
    result = cursor.fetchone()
    if result is None or result[0] != 'teacher':
        conn.close()
        return {'message': 'User is not a teacher'}, 403

    # Get subject_id from database by subject name
    cursor.execute("SELECT id FROM subjects WHERE name = ?", (subject_name,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'Subject not found'}, 404

    subject_id = result[0]

    # Get marks for all students in the subject
    cursor.execute("""
        SELECT users.username, grades.grade, grades.pair 
        FROM grades 
        JOIN users ON grades.user_id = users.id
        WHERE grades.subject_id = ?
    """, (subject_id,))
    marks = cursor.fetchall()
    conn.close()

    # Format the result
    marks_by_student = {}
    for username, grade, pair in marks:
        if username not in marks_by_student:
            marks_by_student[username] = []
        marks_by_student[username].append({'grade': grade, 'pair': pair})

    return jsonify({'message': 'Marks for all students retrieved successfully', 'data': marks_by_student}), 200


UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

from fuzzywuzzy import fuzz
from fuzzywuzzy import process
import logging
import fitz
logging.getLogger().setLevel(logging.ERROR)
import chardet
import re

import re
from fuzzywuzzy import process, fuzz
import chardet

def check_toc(toc):
    while True:
        made_changes = False
        for i in range(len(toc) - 1):
            if toc[i][0] == toc[i + 1][0] and toc[i][2] > toc[i + 1][2]:
                # Swap places
                toc[i], toc[i + 1] = toc[i + 1], toc[i]
                made_changes = True
            elif toc[i][2] > toc[i + 1][2]:
                # Remove this element
                toc.pop(i + 1)
                made_changes = True
                break  # Break out of the loop after removing an element
        if not made_changes:
            break  # If no changes were made in the current pass, we're done
    return toc

def extract_text_from_blocks(blocks):
    text = ''
    for block_list in blocks:
        for block in block_list:
            text_block = block[4]
            # Ensure text_block is bytes
            if isinstance(text_block, str):
                text_block = text_block.encode()
            # Detect encoding
            result = chardet.detect(text_block)
            charenc = result['encoding']
            # Decode the text
            try:
                text_block = text_block.decode(charenc)
            except UnicodeDecodeError:
                text_block = text_block.decode(charenc, errors='replace')
            text_block = text_block.replace('-\n', '')
            text += text_block
    return text

def similar(a, b):
    return max([fuzz.ratio(a.lower().strip(), b.lower().strip()) / 100,
                fuzz.ratio(a.lower().replace('глава', '').replace("\n", "").strip(),
                           b.lower().replace('глава', '').replace("\n", "").strip()) / 100])

def get_blocks_on_page(doc, page_number):
    page = doc[page_number]
    textPage = page.get_textpage()
    blocks = textPage.extractBLOCKS()
    blocks.sort(key=lambda x: x[3])
    # Filter blocks by using fuzzywuzzy to exclude blocks with "Глава n" with 90% similarity
    blocks = [block for block in blocks if similar(block[4], 'Глава 1\n') < 0.85]
    return blocks

def get_blocks_on_pages(doc, pages):
    blocks = []
    for page_number in pages:
        blocks.append(get_blocks_on_page(doc, page_number))
    return blocks

def process_text_header(text):
    text = text.replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    # Remove special characters
    text = re.sub(r'[^a-zA-Zа-яА-Я0-9\s]', '', text)
    # Remove double spaces
    text = re.sub(r'\s+', ' ', text)
    # Remove leading and trailing spaces
    text = text.strip()
    # Lowercase
    text = text.lower()
    return text

def split_pdf_by_toc(pdf_document, toc):
    found_titles = 0
    not_found_titles = 0
    found_half = 0
    text_in_toc = {}
    for toc_elem in toc:
        level, title, page_number = toc_elem
        next_block_title = None
        if toc.index(toc_elem) < len(toc) - 1:
            next_block_title = toc[toc.index(toc_elem) + 1][1]
        # Get textPage object for the page
        start_page = page_number
        # Get endpage by checking next element in toc
        # If it is last element, then it is the last page of the document
        if toc.index(toc_elem) == len(toc) - 1:
            end_page = pdf_document.page_count
        else:
            end_page = toc[toc.index(toc_elem) + 1][2]
        pages = list(range(start_page - 1, end_page))
        blocks = get_blocks_on_pages(pdf_document, pages)
        # Find index of block with header and block with next header
        header_block_index = None
        next_header_block_index = None
        g = 0
        for i in range(len(blocks)):
            for j in range(len(blocks[i])):
                block_text = blocks[i][j][4]
                best_match_cur_head, score_cur = process.extractOne(title, [block_text])
                if next_block_title:
                    best_match_next_head, score_next = process.extractOne(next_block_title, [block_text])
                if score_cur >= 90 and i == 0:
                    header_block_index = g
                if next_block_title and score_next >= 90 and i == len(blocks) - 1:
                    next_header_block_index = g
                    break
                g += 1
        # Get blocks only between header and next header
        # Flatten blocks array to 1D
        blocks = [block for block_list in blocks for block in block_list]
        if header_block_index is not None and next_header_block_index:
            found_titles += 1
            blocks = blocks[header_block_index: next_header_block_index]
        # If header_block_index not none or next_header_block_index not none
        if (int(header_block_index is not None)) + (int(next_header_block_index is not None)) == 1:
            found_half += 1
            if next_header_block_index is None:
                blocks = blocks[header_block_index:]
            else:
                blocks = blocks[:next_header_block_index]
        if header_block_index is None and next_header_block_index is None:
            not_found_titles += 1
            continue
        text = extract_text_from_blocks([blocks])
        text_in_toc[process_text_header(title)] = text
    print(f'{found_titles} - {not_found_titles} - {found_half}')
    return text_in_toc, found_titles, not_found_titles, found_half


def processPDF(pdf_path):
    doc_lists = []
    doc = fitz.open(pdf_path)
    toc = doc.get_toc()
    toc_ = check_toc(toc)
    doc_list, a, b, c = split_pdf_by_toc(doc, toc_)
    doc_lists.append(doc_list)
    total_found = a
    total_not_found = b
    total_found_half = c
    doc.close()
    return doc_lists, total_found, total_not_found, total_found_half

@app.route('/api/readPDF', methods=['POST'])
def readPDF():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith('.pdf'):
        try:
            # File is PDF file
            # Save it to the uploads folder
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            # Process the PDF
            doc_lists, total_found, total_not_found, total_found_half = processPDF(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            if total_found == 0:
                os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
                return jsonify({"error": "No titles found"}), 400
            # Delete the uploaded file
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            return jsonify({"message": "PDF read successfully!", "data": doc_lists, "total_found": total_found, "total_not_found": total_not_found, "total_found_half": total_found_half}), 200
        except:
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            return jsonify({"error": "Error reading PDF"}), 400
    else:
        return jsonify({"error": "Invalid file type"}), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
