import os
import json
from flask import Flask, jsonify, request
from urllib.parse import unquote
import sqlite3

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
    username = request.args.get('username')  # Get username from query parameters
    if not username:
        return {'message': 'Username is required'}, 400
    
    # Get user_id from database by username
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    result = cursor.fetchone()
    if result is None:
        conn.close()
        return {'message': 'User not found'}, 404
    
    user_id = result[0]
    
    # Get marks from database for the user and join with subjects to get subject_name
    cursor.execute("""
        SELECT grades.grade, grades.pair, subjects.name 
        FROM grades 
        JOIN subjects ON grades.subject_id = subjects.id 
        WHERE grades.user_id = ?
    """, (user_id,))
    marks = cursor.fetchall()
    conn.close()
    
    # Prepare the data in the format expected by the frontend
    data = [{'grade': mark[0], 'pair': mark[1], 'subject_name': mark[2]} for mark in marks]
    
    return jsonify({'message': 'Marks retrieved successfully', 'data': data}), 200

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
