from config import app, db
from models.models import User, Problem 
from datetime import datetime 


with app.app_context():
    # Clear existing data to avoid duplicates
    Problem.query.delete()
    db.session.commit()

    User.query.delete()
    db.session.commit()

    users = []

    user1 = User(
        email = 'amii911@example.com', 
        user_name = 'Amii911', 
        picture = 'https://example.com/amii911.jpg', 
        oauth_provider = 'google',  
        oauth_id = 'google_oauth_id_12345',  # Replace with actual OAuth ID
        is_admin = False
        )
    users.append(user1)

    user2 = User(
        email = 'amy5678@example.com', 
        user_name = 'Amy5678', 
        picture = 'https://example.com/amy5678.jpg', 
        oauth_provider = 'github', 
        oauth_id = 'github_oauth_id_67890',  # Replace with actual OAuth ID
        is_admin = False
        )
    users.append(user2)

    db.session.add_all(users)
    db.session.commit()

    problems = []

    problem1 = Problem(
        problem_name = "Two Sum",  
        problem_link = "https://leetcode.com/problems/two-sum/",  
        difficulty = "Easy",  
        category = "Arrays",  
        date_attempted = str(datetime.now().date()),  
        status = "Completed",
        notes = "Classic problem. Implemented with a hash map to optimize solution.",  
        num_attempts = 1 
    )
    problems.append(problem1)

    problem2 = Problem(
        problem_name="Add Two Numbers",  
        problem_link="https://leetcode.com/problems/add-two-numbers/",
        difficulty="Medium",
        category="Linked Lists",
        date_attempted=str(datetime.now().date()),
        status="Attempted",  
        notes="Used a two-pointer technique, still need to improve edge cases.",
        num_attempts=2
    )
    problems.append(problem2)

    db.session.add_all(problems)
    db.session.commit()

    # Optionally associate user with problem (if you have a many-to-many relationship)
    # user1.problems.append(problem1)
    # db.session.commit()

    print("Seeding completed!")

if __name__ == "__main__":
  with app.app_context():
    print("Starting seed...")
