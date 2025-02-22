from random import randint
from consts import TESTS_PATH, EASY_TEST_COUNT, RANGE, MEDIUM_TEST_COUNT, HARD_TEST_COUNT, Difficulty

def generate(d: Difficulty) -> tuple[tuple[str, int, str], str]:
    if d == Difficulty.EASY:
        n = randint(0, EASY_TEST_COUNT - 1)
    elif d == Difficulty.MEDIUM:
        n = randint(0, MEDIUM_TEST_COUNT - 1)
    else:
        n = randint(0, HARD_TEST_COUNT - 1)
    test_case = __import__(f'{TESTS_PATH.name}.{d.value}._{n}', fromlist=["get_template", "NAME"])
    return ((d.value, n, test_case.NAME), test_case.get_template())


def generate_template(difficulty: Difficulty, num: int) -> dict:
    """
    generates num testcases of difficulty difficulty
    """
    template = {
        "nums": {},
        "template": ""
    }
    weights = [0, 0] # hard, medium
    if difficulty == Difficulty.MEDIUM:
        weights = [0.1, 0.8]
    elif difficulty == Difficulty.HARD:
        weights = [0.7, 1]
    for i in range(num):
        r = randint(0, RANGE)
        if r < weights[0] * RANGE:
            test_num, test_content = generate(Difficulty.HARD)
        elif r < weights[1] * RANGE:
            test_num, test_content = generate(Difficulty.MEDIUM)
        else:
            test_num, test_content = generate(Difficulty.EASY)
        template["nums"][str(i)] = (test_num)
        template["template"] += test_content + "\n"
    
    return template
