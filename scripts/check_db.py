
import sqlite3

def check_schema():
    conn = sqlite3.connect('medvision.db')
    cursor = conn.cursor()
    print("--- users table ---")
    cursor.execute("PRAGMA table_info(users)")
    for col in cursor.fetchall(): print(col)
    
    print("\n--- reports table ---")
    cursor.execute("PRAGMA table_info(reports)")
    for col in cursor.fetchall(): print(col)
    conn.close()

if __name__ == "__main__":
    check_schema()
