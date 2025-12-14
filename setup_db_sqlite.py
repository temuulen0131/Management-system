#!/usr/bin/env python
"""
Simple database setup for SQLite
"""
import os
import sys
import django

def main():
    print("=" * 60)
    print("🚀 Task Manager Database Setup (SQLite)")
    print("=" * 60)
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskmanager.settings')
    django.setup()
    
    from django.core.management import call_command
    from django.contrib.auth.models import User, Group
    from tasks.models import Department
    
    print("\n🔄 Running migrations...")
    call_command('migrate', verbosity=1)
    print("✅ Migrations completed")
    
    print("\n👥 Creating user groups...")
    groups = ['Admin', 'Manager', 'Employee', 'Client']
    for group_name in groups:
        group, created = Group.objects.get_or_create(name=group_name)
        if created:
            print(f"   ✅ Created group: {group_name}")
        else:
            print(f"   ℹ️  Group exists: {group_name}")
    
    print("\n🏢 Creating default department...")
    dept, created = Department.objects.get_or_create(name="IT Support")
    if created:
        print(f"   ✅ Created department: IT Support")
    else:
        print(f"   ℹ️  Department exists: IT Support")
    
    print("\n👤 Creating superuser...")
    if User.objects.filter(username='admin').exists():
        print("   ℹ️  Superuser 'admin' already exists")
    else:
        user = User.objects.create_superuser(
            username='admin',
            email='admin@taskmanager.com',
            password='admin123'
        )
        # Add to Admin group
        admin_group = Group.objects.get(name='Admin')
        user.groups.add(admin_group)
        print("   ✅ Superuser created")
        print("   Username: admin")
        print("   Password: admin123")
    
    print("\n" + "=" * 60)
    print("✅ Setup completed successfully!")
    print("=" * 60)
    print("\n📝 Next steps:")
    print("   1. Start backend: ./start-backend.sh")
    print("   2. Start frontend: ./start-frontend.sh")
    print("   3. Visit: http://localhost:3000")
    print("\n")

if __name__ == '__main__':
    main()
