#!/usr/bin/env python3
"""
Make a monthly edit PDF fast to open in the website's viewer.

Some export tools give every page one shared list of *all* the images in the
file. The viewer loads everything a page lists before drawing it, so even
page 1 would need the whole file. This rewrites each page (and each embedded
form) to list only the images it actually uses. Nothing visible changes.

Usage:
    npm run pdf:optimize -- public/catalogue/edits/2026-12-<name>.pdf

Rewrites the file in place. Safe to run more than once.
Needs pypdf:  pip3 install pypdf
"""
import re
import sys

try:
    import pypdf
    from pypdf.generic import DictionaryObject, NameObject, StreamObject
except ImportError:
    sys.exit("pypdf is missing. Install it with: pip3 install pypdf")

# Any /Name token in a content stream; used to see which images it draws.
NAME = re.compile(rb"/([^\s/\[\]<>(){}%]+)")


def trim_resources(holder, content: bytes) -> int:
    """Keep only the XObjects named in `content`. Returns how many were kept."""
    if "/Resources" not in holder:
        return 0
    used = {m.decode("latin1") for m in NAME.findall(content)}
    resources = holder["/Resources"].get_object()
    trimmed = DictionaryObject()
    kept = 0
    for key, value in resources.items():
        if key == "/XObject":
            xobjects = {k: v for k, v in value.get_object().items() if k[1:] in used}
            trimmed[NameObject(key)] = DictionaryObject(xobjects)
            kept = len(xobjects)
        else:
            trimmed[NameObject(key)] = value
    holder[NameObject("/Resources")] = trimmed
    return kept


def optimize(path: str) -> None:
    writer = pypdf.PdfWriter(clone_from=pypdf.PdfReader(path))

    for page in writer.pages:
        content = page.get_contents()
        trim_resources(page, content.get_data() if content is not None else b"")

    # Forms can point back at the shared list too, so trim them as well.
    for obj in list(writer._objects):
        if isinstance(obj, StreamObject) and obj.get("/Subtype") == "/Form":
            trim_resources(obj, obj.get_data())

    writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
    writer.write(path)

    # Report the result.
    reader = pypdf.PdfReader(path)
    per_page = [len(p["/Resources"].get("/XObject", {})) for p in reader.pages]
    print(f"{path}: {len(per_page)} pages, images per page: {per_page}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for pdf in sys.argv[1:]:
        optimize(pdf)
