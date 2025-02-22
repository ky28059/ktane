def check(a: list) -> int:
    return sum(a)

NAME = "sum_list"

def get_template() -> str:
    return """
'''
Return sum of list
params: a: list
returns int
'''
def sum_list(a: list) -> int:
    pass
"""