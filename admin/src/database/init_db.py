# Database Initialization Script
# This script creates the MySQL database and tables for the Sutraty application

import pymysql
import os
"""init_db.py

Seeding and database creation helper.

This program will create the MySQL database (if it doesn't exist) using PyMySQL,
then leverage the ORM helper `create_tables` to create the tables and seed data.
The advantage is that we keep low-level DB creation here but reuse the application
level seeder to ensure consistent schema and seed data.
"""
import pymysql
from config import MYSQL_DB, MYSQL_HOST, MYSQL_USER, MYSQL_PORT, MYSQL_PWD


def create_database_if_missing():
    """Create the DB schema if it doesn't exist using raw SQL.

    After creating the database we will call the ORM-based seeder from the
    application to create required tables and seed data.
    """
    conn = None
    try:
        conn = pymysql.connect(host=MYSQL_HOST, port=MYSQL_PORT, user=MYSQL_USER, password=MYSQL_PWD)
        conn.autocommit(True)
        cur = conn.cursor()
        cur.execute(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DB}`;")
        print(f"Database '{MYSQL_DB}' ensured (created if missing)")
    finally:
        if conn:
            conn.close()


def run_create_tables_via_app(seed=True):
    """Import the Flask app and invoke the ORM table creation seeder.

    Importing `app` will not start the server, but will allow us to access the
    SQLAlchemy `db` instance and call the helper that creates tables and seeds data.
    """
    try:
        # Import the app late to avoid import cycles at top-level
        from admin.src.backend.app import app  # noqa: E402
        from database.datatables import create_tables  # noqa: E402

        create_tables(app, seed=seed)
        print('init_db: ORM tables created and seeded via create_tables()')
    except Exception as e:
        print('init_db: failed to create tables via app/datatables:', e)


def main(skip_seed=False):
    create_database_if_missing()
    run_create_tables_via_app(seed=not skip_seed)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Initialize Sutraty DB and optionally seed sample data')
    parser.add_argument('--skip-seed', action='store_true', help='Do not seed sample data (useful for preserving manual changes)')
    args = parser.parse_args()
    main(skip_seed=args.skip_seed)
