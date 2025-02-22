def check() -> bool:
    return __import__('random').randint(1, 6) == 4

NAME = "russian_roulette"

def get_template() -> str:
    return """
'''
There is a 1 in 6 chance this function returns True
returns bool
'''
def russian_roulette() -> bool:
    pass
"""