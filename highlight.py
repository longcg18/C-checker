def highlight_tokens(tokens, matched_indexes):

    result = []

    matched_set = set(matched_indexes)

    i = 0

    while i < len(tokens):

        # matched span
        if i in matched_set:

            span = []

            while i < len(tokens) and i in matched_set:
                span.append(tokens[i])
                i += 1

            result.append(
                f"<mark>{''.join(span)}</mark>"
            )

        else:
            result.append(tokens[i])
            i += 1

    return "".join(result)
