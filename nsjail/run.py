from consts import Difficulty
from expected import validate

def run(tests: dict[str, tuple[str, str]], usercode: str) -> dict:
    ret = {}

    exec(usercode, globals())

    for key in tests.keys():
        difficulty, test_num, func_name = tests[key]
        if func_name in globals():
            ret[str(key)] = validate(Difficulty(difficulty), int(test_num), globals()[func_name])

    return ret