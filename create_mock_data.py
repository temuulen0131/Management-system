#!/usr/bin/env python3
"""
Create mock data for testing the Task Management System
"""
import os
import django
import sys
from datetime import datetime, timedelta
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskmanager.settings')
django.setup()

from django.contrib.auth.models import User, Group
from tasks.models import Department, Client, ClientRequest, Task, TaskComment, TaskLog

def create_mock_data():
    print("=" * 60)
    print("🎭 Creating Mock Data for Testing")
    print("=" * 60)
    
    # Get or create groups
    manager_group, _ = Group.objects.get_or_create(name='Manager')
    employee_group, _ = Group.objects.get_or_create(name='Employee')
    client_group, _ = Group.objects.get_or_create(name='Client')
    
    # Create Managers
    print("\n👔 Creating Managers...")
    managers = []
    manager_data = [
        {'username': 'alice_manager', 'email': 'alice@company.com', 'first_name': 'Alice', 'last_name': 'Johnson'},
        {'username': 'bob_manager', 'email': 'bob@company.com', 'first_name': 'Bob', 'last_name': 'Smith'},
    ]
    
    for data in manager_data:
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults={
                'email': data['email'],
                'first_name': data['first_name'],
                'last_name': data['last_name'],
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            user.groups.add(manager_group)
            print(f"   ✅ Created manager: {user.username}")
        managers.append(user)
    
    # Create Employees
    print("\n👷 Creating Employees...")
    employees = []
    employee_data = [
        {'username': 'sarah_tech', 'email': 'sarah@company.com', 'first_name': 'Sarah', 'last_name': 'Employee'},
        {'username': 'john_tech', 'email': 'john@company.com', 'first_name': 'John', 'last_name': 'Tech'},
        {'username': 'emma_support', 'email': 'emma@company.com', 'first_name': 'Emma', 'last_name': 'Support'},
        {'username': 'david_dev', 'email': 'david@company.com', 'first_name': 'David', 'last_name': 'Developer'},
        {'username': 'lisa_analyst', 'email': 'lisa@company.com', 'first_name': 'Lisa', 'last_name': 'Analyst'},
    ]
    
    for data in employee_data:
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults={
                'email': data['email'],
                'first_name': data['first_name'],
                'last_name': data['last_name'],
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            user.groups.add(employee_group)
            print(f"   ✅ Created employee: {user.username}")
        employees.append(user)
    
    # Create Clients
    print("\n👥 Creating Clients...")
    clients = []
    client_data = [
        {'username': 'mike_client', 'email': 'mike@company.com', 'first_name': 'Mike', 'last_name': 'Client'},
        {'username': 'lisa_business', 'email': 'lisa@business.com', 'first_name': 'Lisa', 'last_name': 'Business'},
        {'username': 'tom_user', 'email': 'tom@startup.com', 'first_name': 'Tom', 'last_name': 'User'},
        {'username': 'jane_corp', 'email': 'jane@corp.com', 'first_name': 'Jane', 'last_name': 'Corporate'},
    ]
    
    for data in client_data:
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults={
                'email': data['email'],
                'first_name': data['first_name'],
                'last_name': data['last_name'],
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            user.groups.add(client_group)
            print(f"   ✅ Created client: {user.username}")
        clients.append(user)
    
    # Create Departments
    print("\n🏢 Creating Departments...")
    departments = []
    dept_names = ['IT Support', 'Network', 'Software Development', 'Security', 'Database']
    
    for name in dept_names:
        dept, created = Department.objects.get_or_create(name=name)
        if created:
            print(f"   ✅ Created department: {name}")
        departments.append(dept)
    
    # Create Client records
    print("\n📋 Creating Client Records...")
    client_records = []
    for user in clients:
        client_rec, created = Client.objects.get_or_create(
            name=f"{user.first_name} {user.last_name}",
            defaults={'department': random.choice(['IT', 'Finance', 'HR', 'Operations'])}
        )
        if created:
            print(f"   ✅ Created client record: {client_rec.name}")
        client_records.append(client_rec)
    
    # Create Client Requests
    print("\n📝 Creating Client Requests...")
    categories = ['SOFTWARE', 'HARDWARE', 'NETWORK', 'ACCOUNT', 'OTHER']
    request_descriptions = [
        'Email not working properly',
        'Need access to shared drive',
        'Computer running slow',
        'Printer not responding',
        'Password reset needed',
        'Software installation request',
    ]
    
    for i in range(10):
        ClientRequest.objects.get_or_create(
            client=random.choice(client_records),
            category=random.choice(categories),
            description=random.choice(request_descriptions)
        )
    print(f"   ✅ Created {ClientRequest.objects.count()} client requests")
    
    # Create Tasks
    print("\n✅ Creating Tasks...")
    task_titles = [
        'Fix email server configuration',
        'Install new software for accounting',
        'Replace broken keyboard',
        'Setup new employee workstation',
        'Troubleshoot network connectivity',
        'Backup database servers',
        'Update antivirus definitions',
        'Configure VPN access',
        'Restore deleted files',
        'Optimize database performance',
        'Fix printer driver issues',
        'Setup video conferencing',
        'Migrate data to new server',
        'Implement firewall rules',
        'Deploy security patches',
    ]
    
    task_descriptions = [
        'User reported issues with email client. Need to check server settings and reconfigure.',
        'Finance department needs new accounting software installed on 5 machines.',
        'Hardware failure - keyboard keys not responding. Need replacement.',
        'New hire starting Monday. Setup computer, accounts, and access permissions.',
        'Multiple users cannot access shared network drive. Investigate and resolve.',
        'Scheduled monthly backup of all critical database systems.',
        'Security update - push latest antivirus definitions to all workstations.',
        'Remote employee needs VPN configured for secure access.',
        'Accidentally deleted important files. Attempt recovery from backup.',
        'Database queries running slow. Need optimization and indexing.',
        'Print jobs getting stuck in queue. Driver update or reinstall needed.',
        'Conference room equipment not working. Test and configure properly.',
        'Old server being decommissioned. Migrate all data safely.',
        'Security audit found gaps. Update firewall rules accordingly.',
        'Critical security patches available. Deploy to all systems.',
    ]
    
    statuses = ['pending', 'in_progress', 'in_review', 'completed']
    priorities = ['low', 'medium', 'high', 'urgent']
    
    tasks_created = []
    for i in range(len(task_titles)):
        # Random dates for variety
        created_days_ago = random.randint(1, 30)
        created_date = datetime.now() - timedelta(days=created_days_ago)
        due_days = random.randint(1, 14)
        due_date = created_date + timedelta(days=due_days)
        
        status = random.choice(statuses)
        assigned_to = random.choice(employees) if status != 'pending' else None
        
        task, created = Task.objects.get_or_create(
            title=task_titles[i],
            defaults={
                'description': task_descriptions[i],
                'status': status,
                'priority': random.choice(priorities),
                'department': random.choice(departments),
                'assigned_to': assigned_to,
                'created_by': random.choice(clients + managers),
                'due_date': due_date,
            }
        )
        
        if created:
            # Manually set created_at for variety
            Task.objects.filter(id=task.id).update(created_at=created_date)
            print(f"   ✅ Created task: {task.title[:50]}...")
            tasks_created.append(task)
    
    # Create Task Comments
    print("\n💬 Creating Task Comments...")
    comment_texts = [
        'I\'ve started working on this issue.',
        'Waiting for client to provide more details.',
        'Hardware ordered, will arrive tomorrow.',
        'Issue resolved. Testing now.',
        'Need manager approval before proceeding.',
        'Client confirmed the fix is working.',
        'Escalating to senior technician.',
        'Scheduled maintenance window for tonight.',
        'Successfully completed. Closing ticket.',
        'Found root cause - updating documentation.',
    ]
    
    comments_count = 0
    for task in tasks_created[:10]:  # Add comments to first 10 tasks
        for _ in range(random.randint(1, 3)):
            TaskComment.objects.get_or_create(
                task=task,
                user=random.choice(employees + managers),
                defaults={'comment': random.choice(comment_texts)}
            )
            comments_count += 1
    print(f"   ✅ Created {comments_count} task comments")
    
    # Create Task Logs
    print("\n📊 Creating Task Activity Logs...")
    
    logs_count = 0
    for task in tasks_created:
        # Create log for status changes
        if task.status in ['in_progress', 'in_review', 'completed']:
            TaskLog.objects.get_or_create(
                task=task,
                action_type='STATUS_CHANGE',
                defaults={
                    'user': task.assigned_to or random.choice(employees),
                    'old_value': 'pending',
                    'new_value': task.status
                }
            )
            logs_count += 1
        
        # Add assignment log if assigned
        if task.assigned_to:
            TaskLog.objects.get_or_create(
                task=task,
                action_type='ASSIGNMENT_CHANGE',
                defaults={
                    'user': random.choice(managers),
                    'old_value': 'Unassigned',
                    'new_value': f'{task.assigned_to.first_name} {task.assigned_to.last_name}'
                }
            )
            logs_count += 1
    
    print(f"   ✅ Created {logs_count} task log entries")
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ Mock Data Creation Complete!")
    print("=" * 60)
    print(f"\n📊 Summary:")
    print(f"   • Managers: {User.objects.filter(groups__name='Manager').count()}")
    print(f"   • Employees: {User.objects.filter(groups__name='Employee').count()}")
    print(f"   • Clients: {User.objects.filter(groups__name='Client').count()}")
    print(f"   • Departments: {Department.objects.count()}")
    print(f"   • Client Records: {Client.objects.count()}")
    print(f"   • Client Requests: {ClientRequest.objects.count()}")
    print(f"   • Tasks: {Task.objects.count()}")
    print(f"   • Task Comments: {TaskComment.objects.count()}")
    print(f"   • Task Logs: {TaskLog.objects.count()}")
    
    print(f"\n🔑 Test Credentials (all passwords: password123):")
    print(f"   Admin: admin / admin123")
    print(f"   Manager: alice_manager / password123")
    print(f"   Employee: sarah_tech / password123")
    print(f"   Client: mike_client / password123")
    
    print(f"\n🚀 Ready to test at http://localhost:3000")
    print("=" * 60)

if __name__ == '__main__':
    try:
        create_mock_data()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
