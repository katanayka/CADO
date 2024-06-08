import json
import sqlite3
import random
import pandas as pd
import re

file_path = "./students.db"

# Read json (discipline_data.json)
with open("H:/DIPLOM/CADO/server/discipline_data.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Read csv (../export (1).csv)
df = pd.read_csv("../export (1).csv")

names_df = df[["name"]]
list_of_names = (names_df.values.tolist())

# Unpack arrays in list_of_names
list_of_names = [item for sublist in list_of_names for item in sublist]
print(len(list_of_names))
print(set(list_of_names))
