from consts import TESTS_PATH, EASY_TEST_COUNT, Difficulty, MEDIUM_TEST_COUNT, HARD_TEST_COUNT, NUM_TEST_CASES
from random import randint, shuffle, uniform
from secrets import token_hex

def generate_sample_data(func: callable, annotations: dict) -> tuple:
    args = []
    for key in annotations.keys():
        if key == "return":
            continue
        if isinstance(annotations[key](), int):
            args.append(randint(-20, 20))
        if isinstance(annotations[key](), str):
            args.append(token_hex(randint(1, 3)))
        if isinstance(annotations[key](), float):
            args.append(uniform(0.0, 100.0))
        if isinstance(annotations[key](), list):
            l = list(range(randint(0, 100)))
            shuffle(l)
            args.append(l)
    return (args, func(*args))
        



def validate(difficulty: Difficulty, num: int, user_func: callable) -> bool:
    func = __import__(f'{TESTS_PATH.name}.{difficulty.value}._{num}', fromlist=["check"]).check
    annotations = func.__annotations__
    for _ in range(NUM_TEST_CASES):
        args, res = generate_sample_data(func, annotations)
        if user_func(*args) != res:
            return False
    return True
