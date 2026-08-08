class EmailProvider:

    def send(
        self,
        title,
        message
    ):

        print(
            "EMAIL:",
            title
        )

        return True