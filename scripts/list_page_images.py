"""Pick a replacement city image from the Wikipedia page media list."""

import json
import pathlib
import re
import sys
import urllib.parse
import urllib.request

UA = "RemotionCityRanking/1.0 (educational video)"
ROOT = pathlib.Path(__file__).resolve().parent.parent


def get_json(url: str) -> dict:
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=40) as response:
        return json.loads(response.read())


def media_list(title: str):
    url = (
        "https://en.wikipedia.org/api/rest_v1/page/media-list/"
        + urllib.parse.quote(title.replace(" ", "_"), safe="")
    )
    return get_json(url).get("items", [])


if __name__ == "__main__":
    title = sys.argv[1]
    for item in media_list(title):
        if item.get("type") != "image":
            continue
        print(item.get("title"), "|", item.get("srcset", [{}])[0].get("src", "")[:120])
