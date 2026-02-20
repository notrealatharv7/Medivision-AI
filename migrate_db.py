
import sqlite3

def migrate():
    conn = sqlite3.connect('medvision.db')
    cursor = conn.cursor()
    
    # Check users table
    cursor.execute("PRAGMA table_info(users)")
    user_columns = [col[1] for col in cursor.fetchall()]
    
    missing_user_cols = {
        'age': 'INTEGER',
        'gender': 'VARCHAR',
        'weight': 'INTEGER',
        'health_history': 'TEXT'
    }
    
    for col, col_type in missing_user_cols.items():
        if col not in user_columns:
            print(f"Adding column {col} to users table...")
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col} {col_type}")
    
    # Check reports table
    cursor.execute("PRAGMA table_info(reports)")
    report_columns = [col[1] for col in cursor.fetchall()]
    
    missing_report_cols = {
        'extracted_data': 'TEXT',
        'ai_explanation': 'TEXT',
        'risks': 'TEXT',
        'diet_plan': 'TEXT',
        'exercise_plan': 'TEXT'
    }
    
    for col, col_type in missing_report_cols.items():
        if col not in report_columns:
            print(f"Adding column {col} to reports table...")
            cursor.execute(f"ALTER TABLE reports ADD COLUMN {col} {col_type}")
            
    conn.commit()
    conn.close()
    print("Migration completed.")

if __name__ == "__main__":
    migrate()
