#!/usr/local/bin/python3

from pathlib import Path
from enum import Enum

RANGE = 100
TESTS_PATH = Path("tests")
EASY_TEST_COUNT = 10
MEDIUM_TEST_COUNT = 10
HARD_TEST_COUNT = 3
NUM_TEST_CASES = 1000
CHROOT_DIR = '/chroot'

class Difficulty(str, Enum):
    EASY = 'easy'
    MEDIUM = 'medium'
    HARD = 'hard'