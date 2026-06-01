from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Task
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)

VALID_PRIORITIES = ['low', 'medium', 'high']
VALID_STATUSES = ['todo', 'in_progress', 'done']


@tasks_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    """Get all tasks for the authenticated user with optional filters."""
    user_id = get_jwt_identity()

    # Optional filters from query params
    status = request.args.get('status')
    priority = request.args.get('priority')
    search = request.args.get('search')

    query = Task.query.filter_by(user_id=user_id)

    if status and status in VALID_STATUSES:
        query = query.filter_by(status=status)

    if priority and priority in VALID_PRIORITIES:
        query = query.filter_by(priority=priority)

    if search:
        query = query.filter(Task.title.ilike(f'%{search}%'))

    tasks = query.order_by(Task.created_at.desc()).all()

    return jsonify({
        'tasks': [task.to_dict() for task in tasks],
        'count': len(tasks)
    }), 200


@tasks_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    """Create a new task."""
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400

    if data.get('priority') and data['priority'] not in VALID_PRIORITIES:
        return jsonify({'error': f'Priority must be one of: {VALID_PRIORITIES}'}), 400

    if data.get('status') and data['status'] not in VALID_STATUSES:
        return jsonify({'error': f'Status must be one of: {VALID_STATUSES}'}), 400

    # Parse due date if provided
    due_date = None
    if data.get('due_date'):
        try:
            due_date = datetime.fromisoformat(data['due_date'])
        except ValueError:
            return jsonify({'error': 'Invalid due_date format. Use ISO format (YYYY-MM-DD)'}), 400

    task = Task(
        user_id=user_id,
        title=data['title'],
        description=data.get('description', ''),
        priority=data.get('priority', 'medium'),
        status=data.get('status', 'todo'),
        due_date=due_date
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({
        'message': 'Task created successfully',
        'task': task.to_dict()
    }), 201


@tasks_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """Get a single task by ID."""
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    return jsonify({'task': task.to_dict()}), 200


@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """Update an existing task."""
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    data = request.get_json()

    if data.get('priority') and data['priority'] not in VALID_PRIORITIES:
        return jsonify({'error': f'Priority must be one of: {VALID_PRIORITIES}'}), 400

    if data.get('status') and data['status'] not in VALID_STATUSES:
        return jsonify({'error': f'Status must be one of: {VALID_STATUSES}'}), 400

    # Update fields if provided
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'priority' in data:
        task.priority = data['priority']
    if 'status' in data:
        task.status = data['status']
    if 'due_date' in data:
        try:
            task.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
        except ValueError:
            return jsonify({'error': 'Invalid due_date format'}), 400

    task.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        'message': 'Task updated successfully',
        'task': task.to_dict()
    }), 200


@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """Delete a task."""
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({'message': 'Task deleted successfully'}), 200


@tasks_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get task statistics for the authenticated user."""
    user_id = get_jwt_identity()

    total = Task.query.filter_by(user_id=user_id).count()
    todo = Task.query.filter_by(user_id=user_id, status='todo').count()
    in_progress = Task.query.filter_by(user_id=user_id, status='in_progress').count()
    done = Task.query.filter_by(user_id=user_id, status='done').count()
    high_priority = Task.query.filter_by(user_id=user_id, priority='high').count()

    return jsonify({
        'total': total,
        'todo': todo,
        'in_progress': in_progress,
        'done': done,
        'high_priority': high_priority
    }), 200
