def sliding_window_tokens(tokens, window_size, step=1):
    """Yield sliding windows over a list of tokens.

    Args:
        tokens (list[str]): The tokenized sentence.
        window_size (int): Number of tokens in each window.
        step (int): Step size between windows.

    Yields:
        list[str]: A window of tokens.
    """
    if window_size <= 0:
        raise ValueError("window_size must be positive")
    if step <= 0:
        raise ValueError("step must be positive")

    for start in range(0, len(tokens) - window_size + 1, step):
        yield tokens[start:start + window_size]

