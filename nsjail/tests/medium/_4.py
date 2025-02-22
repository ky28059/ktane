def check(radius: int) -> float:
    return round(__import__('math').pi * (radius ** 2), 2)

NAME = "area_of_circle"

def get_template() -> str:
    return """
'''
Return area of the circle with given radius rounded to two decimal places
params: int
returns float
'''
def area_of_circle(radius: int) -> float:
    pass
"""