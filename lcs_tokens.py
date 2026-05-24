def lcs_with_indexes(a_tokens, b_tokens):

    m = len(a_tokens)
    n = len(b_tokens)

    dp = [
        [0]*(n+1)
        for _ in range(m+1)
    ]

    # build dp table
    for i in range(m):
        for j in range(n):

            if a_tokens[i] == b_tokens[j]:
                dp[i+1][j+1] = dp[i][j] + 1

            else:
                dp[i+1][j+1] = max(
                    dp[i][j+1],
                    dp[i+1][j]
                )

    # backtrack
    i = m
    j = n

    matched_indexes = []
    matched_tokens = []

    while i > 0 and j > 0:

        if a_tokens[i-1] == b_tokens[j-1]:

            matched_indexes.append(i-1)
            matched_tokens.append(a_tokens[i-1])

            i -= 1
            j -= 1

        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1

        else:
            j -= 1

    matched_indexes.reverse()
    matched_tokens.reverse()

    return {
        "length": dp[m][n],
        "indexes": matched_indexes,
        "tokens": matched_tokens
    }