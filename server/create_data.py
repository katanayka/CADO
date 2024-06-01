import sqlite3
import random

file_path = "./students.db"

def clear_table(table_name):
    conn = sqlite3.connect(file_path)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS " + table_name)
    conn.commit()
    conn.close()

usernames = [
    "Митрофанова Варвара Егоровна",
    "Симонова Есения Артуровна",
    "Кузнецова Надежда Николаевна",
    "Нечаев Максим Даниилович",
    "Васильева Валерия Алексеевна",
    "Виноградова Мария Ивановна",
    "Константинов Никита Александрович",
    "Калмыков Александр Михайлович",
    "Хохлов Тимур Андреевич",
    "Орлова Ангелина Арсентьевна",
    "Горбачева Анастасия Андреевна",
    "Климова Ксения Данииловна",
    "Лапин Лев Денисович",
    "Аникин Елисей Савельевич",
    "Щеглов Матвей Даниилович",
    "Сахаров Платон Константинович",
    "Титова Амалия Кирилловна",
    "Муравьев Константин Макарович",
    "Иванов Герман Владимирович",
    "Молчанов Илья Владиславович",
    "Комарова Анастасия Владиславовна",
    "Калашников Пётр Львович",
    "Калашников Кирилл Артёмович",
    "Суслов Дамир Матвеевич",
    "Новиков Максим Всеволодович",
    "Климова Аделина Ивановна",
    "Панфилова Алиса Арсентьевна",
    "Гусев Арсений Игоревич",
    "Попов Артём Алексеевич",
    "Архипова Арина Лукинична",
]

passwords = [
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
    "123456",
]

users_teacher = [
    "Козлова Ева Фёдоровна",
    "Борисова Дарья Романовна",
    "Андреев Кирилл Александрович",
    "Румянцев Леонид Андреевич",
]

users_teacher_passwords = [
    "123456",
    "123456",
    "123456",
    "123456",
]

# Clear table users
clear_table("users")

# Fill table users with students (role = "student")
conn = sqlite3.connect(file_path)
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)")
for i in range(len(usernames)):
    cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", (usernames[i], passwords[i], "student"))
conn.commit()
conn.close()

# Fill table users with teachers (role = "teacher")
conn = sqlite3.connect(file_path)
cursor = conn.cursor()
for i in range(len(users_teacher)):
    cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", (users_teacher[i], users_teacher_passwords[i], "teacher"))
conn.commit()
conn.close()

subject_names = [
    "Программирование и основы алгоритмизации",
    "Открытые технологии разработки программного обеспечения",
    "Алгоритмы и технологии параллельных и распределенных вычислений",
    "Компьютерное зрение",
]

subject_paths = [
    "ПиОА",
    "ОТРПО",
    "АТПиРВ",
    "КЗ",
]

# Clear table subjects
clear_table("subjects")

# Fill table subjects
conn = sqlite3.connect(file_path)
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY, name TEXT, path TEXT)")
for i in range(len(subject_names)):
    cursor.execute("INSERT INTO subjects (name, path) VALUES (?, ?)", (subject_names[i], subject_paths[i]))
conn.commit()
conn.close()

group_names = [
    "ПИ1-21",
    "ПИ1-22",
]

# Clear table groups
clear_table("groups")

# Fill table groups
conn = sqlite3.connect(file_path)
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY, name TEXT)")
for i in range(len(group_names)):
    cursor.execute("INSERT INTO groups (name) VALUES (?)", (group_names[i],))
conn.commit()
conn.close()

# clear table user_groups
clear_table("user_groups")

# Fill table user_groups (Split students into 2 groups)
PI1_students = len(usernames) // 2
conn = sqlite3.connect(file_path)
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS user_groups (id INTEGER PRIMARY KEY, user_id INTEGER, group_id INTEGER)")
for i in range(PI1_students):
    cursor.execute("INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)", (i + 1, 1))
    
for i in range(PI1_students, len(usernames)):
    cursor.execute("INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)", (i + 1, 2))
conn.commit()
conn.close()

# Fill table grades with random grades (in sum should be 76)
clear_table("grades")
conn = sqlite3.connect(file_path)
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS grades (id INTEGER PRIMARY KEY, user_id INTEGER, subject_id INTEGER, grade INTEGER, pair INTEGER)")
# Iterate over each student
for i in range(len(usernames)):
    # Iterate over each subject
    for j in range(len(subject_names)):
        sum_should = random.randint(61, 91)
        grades = []
        sum = 0
        # Создай случайные оценки, которые в сумме дадут 76
        while sum < sum_should:
            grade = random.randint(1, 10)
            sum += grade
            grades.append(grade)
        # Вставь оценки в базу данных (user_id, subject_id, grade, pair)
        conn = sqlite3.connect(file_path)
        cursor = conn.cursor()
        for k in range(len(grades)):
            cursor.execute("INSERT INTO grades (user_id, subject_id, grade, pair) VALUES (?, ?, ?, ?)", (i + 1, j + 1, grades[k], k + 1))
        conn.commit()
        conn.close()
        
        
        
        