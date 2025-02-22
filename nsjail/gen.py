from enum import Enum
from random import randint
from pathlib import Path
from pprint import pprint

RANGE = 100
TESTS_PATH = Path("tests")
EASY_TEST_COUNT = 10

class Difficulty(str, Enum):
    EASY = 'easy'
    MEDIUM = 'medium'
    HARD = 'hard'

def generate(d: Difficulty) -> tuple[tuple[str, int], str]:
    n = randint(0, EASY_TEST_COUNT - 1)
    return ((d.value, n), __import__(f'{TESTS_PATH.name}.{d.value}._{n}', fromlist=["get_template"]).get_template())


def generate_template(difficulty: Difficulty, num: int) -> dict:
    """
    generates num testcases of difficulty difficulty
    """
    template = {
        "nums": [],
        "template": ""
    }
    weights = [0, 0] # hard, medium
    if difficulty == Difficulty.MEDIUM:
        weights = [0.1, 0.8]
    elif difficulty == Difficulty.HARD:
        weights = [0.7, 1]
    for _ in range(num):
        r = randint(0, RANGE)
        if r < weights[0] * RANGE:
            test_num, test_content = generate(Difficulty.HARD)
        elif r < weights[1] * RANGE:
            test_num, test_content = generate(Difficulty.MEDIUM)
        else:
            test_num, test_content = generate(Difficulty.EASY)
        template["nums"].append(test_num)
        template["template"] += test_content + "\n"
    
    return template
    
pprint(generate_template(Difficulty.EASY, 5))
