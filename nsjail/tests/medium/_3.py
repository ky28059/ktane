def check(lst: int) -> list:
    return sorted(set(lst))

NAME = "remove_duplicates"

def get_template() -> str:
    return """
'''
Return the list sorted without duplicates
params: list
returns list
'''
def remove_duplicates(a: list) -> list:
    pass
"""