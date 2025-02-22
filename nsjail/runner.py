from enum import Enum
from random import randint

RANGE = 100

class Difficulty(str, Enum):
    EASY = 'easy'
    MEDIUM = 'medium'
    HARD = 'hard'

def generate_easy() -> str:
    pass

def generate_medium() -> str:
    pass

def generate_hard() -> str:
    pass


def generate_template(difficulty: Difficulty, num: int) -> dict:
    """
    generates num testcases of difficulty difficulty
    """
    template = ""
    weights = {1, 0, 0}
    if difficulty == Difficulty.MEDIUM:
        weights = {0.4, 0.4, 0.2}
    elif difficulty == Difficulty.HARD:
        weights = {0, 0.2, 0.8}
    for i in range(num):
        r = randint(0, RANGE)
        if r < weights[0] * RANGE:
            template += generate_easy()

