#!/usr/local/bin/python3

from consts import Difficulty
from expected import validate
from sys import argv
from json import loads, dumps

def run(tests: dict[str, tuple[str, int, str]], usercode: str) -> dict:
    """
    tests: {'0': ('easy', 8, 'all_capital_letters'),
          '1': ('easy', 6, 'sum_list')}, ...
    usercode: their code
    """
    ret = {}

    exec(usercode, globals())

    for key in tests.keys():
        difficulty, test_num, func_name = tests[key]
        if func_name in globals():
            ret[str(key)] = validate(Difficulty(difficulty), int(test_num), globals()[func_name])
        else:
            ret[str(key)] = False

    return ret

if __name__ == "__main__":
    code_fname:str = argv[2]
    cases_fname: str = argv[1]

    with open(code_fname, "r") as f:
        code = f.read()
    with open(cases_fname, "r") as f:
        cases = dict(loads(f.read()))
    print(dumps(run(cases, code)))