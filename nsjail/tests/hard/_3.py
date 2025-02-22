def check(s: str) -> int:
    char_set = set()
    left = 0
    max_len = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len

NAME = "longest_substring_without_repeating"

def get_template() -> str:
    return """
'''
Finds the length of the longest substring without repeating characters
params: str
returns int
'''
def longest_substring_without_repeating(s: str) -> int:
    pass
"""