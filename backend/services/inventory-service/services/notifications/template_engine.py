import json
from pathlib import Path


class TemplateEngine:

    TEMPLATE_DIR = (
        Path(__file__).parent
        / "templates"
    )

    @staticmethod
    def render(
        template_name,
        context
    ):

        template_file = (
            TemplateEngine.TEMPLATE_DIR
            / f"{template_name.lower()}.json"
        )

        if not template_file.exists():

            raise Exception(
                f"Template "
                f"'{template_name}' "
                f"not found"
            )

        with open(
            template_file,
            "r",
            encoding="utf-8"
        ) as file:

            template = json.load(file)

        title = (
            template.get(
                "title",
                ""
            )
        )

        message = (
            template.get(
                "message",
                ""
            )
        )

        for key, value in context.items():

            title = title.replace(
                f"{{{{{key}}}}}",
                str(value)
            )

            message = message.replace(
                f"{{{{{key}}}}}",
                str(value)
            )

        return {

            "type":
                template.get(
                    "code"
                ),

            "severity":
                template.get(
                    "severity",
                    "INFO"
                ),

            "title":
                title,

            "message":
                message,

            "url":
                template.get(
                    "url"
                )

        }