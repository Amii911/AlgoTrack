from config import app, db
from models.models import User, Problem, UserProblem
from datetime import datetime


with app.app_context():
    # Clear existing data to avoid duplicates
    UserProblem.query.delete()
    db.session.commit()

    Problem.query.delete()
    db.session.commit()

    User.query.delete()
    db.session.commit()

    # Create users
    users = []

    user1 = User(
        email = 'amii911@example.com',
        user_name = 'Amii911',
        picture = 'https://example.com/amii911.jpg',
        oauth_provider = 'google',
        oauth_id = 'google_oauth_id_12345',
        is_admin = False
    )
    users.append(user1)

    user2 = User(
        email = 'amy5678@example.com',
        user_name = 'Amy5678',
        picture = 'https://example.com/amy5678.jpg',
        oauth_provider = 'github',
        oauth_id = 'github_oauth_id_67890',
        is_admin = False
    )
    users.append(user2)

    # Email/password user (no OAuth)
    user3 = User(
        email = 'john@example.com',
        user_name = 'JohnDoe',
        picture = '',
        is_admin = False
    )
    user3.set_password('password123')  # Password: password123
    users.append(user3)

    db.session.add_all(users)
    db.session.commit()

    # Create problems (catalog only, no user-specific data)
    problems = []

    problem1 = Problem(
        problem_name = "Two Sum",
        problem_link = "https://leetcode.com/problems/two-sum/",
        difficulty = "Easy",
        category = "Arrays"
    )
    problems.append(problem1)

    problem2 = Problem(
        problem_name = "Add Two Numbers",
        problem_link = "https://leetcode.com/problems/add-two-numbers/",
        difficulty = "Medium",
        category = "Linked Lists"
    )
    problems.append(problem2)

    problem3 = Problem(
        problem_name = "Longest Substring Without Repeating Characters",
        problem_link = "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        difficulty = "Medium",
        category = "Strings"
    )
    problems.append(problem3)

    db.session.add_all(problems)
    db.session.commit()

    # Create user-problem attempts (user-specific data)
    user_problems = []

    # User 1 attempts
    up1 = UserProblem(
        user_id = user1.id,
        problem_id = problem1.id,
        date_attempted = str(datetime.now().date()),
        status = "Completed",
        notes = "Classic problem. Implemented with a hash map to optimize solution.",
        num_attempts = 1
    )
    user_problems.append(up1)

    up2 = UserProblem(
        user_id = user1.id,
        problem_id = problem2.id,
        date_attempted = str(datetime.now().date()),
        status = "Attempted",
        notes = "Used a two-pointer technique, still need to improve edge cases.",
        num_attempts = 2
    )
    user_problems.append(up2)

    # User 2 attempts (same problems, different progress)
    up3 = UserProblem(
        user_id = user2.id,
        problem_id = problem1.id,
        date_attempted = str(datetime.now().date()),
        status = "Attempted",
        notes = "Still working on the optimal solution.",
        num_attempts = 3
    )
    user_problems.append(up3)

    up4 = UserProblem(
        user_id = user2.id,
        problem_id = problem3.id,
        date_attempted = str(datetime.now().date()),
        status = "Completed",
        notes = "Sliding window approach worked well.",
        num_attempts = 1
    )
    user_problems.append(up4)

    db.session.add_all(user_problems)
    db.session.commit()

    print("Seeding completed!")
    print(f"Created {len(users)} users (2 OAuth + 1 email/password), {len(problems)} problems, and {len(user_problems)} user-problem attempts.")

if __name__ == "__main__":
  with app.app_context():
    print("Starting seed...")
