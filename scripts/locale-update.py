#!/usr/bin/env python3
"""Merge nested keys into both locale JSONs. Usage: python3 scripts/locale-update.py"""
import json, sys, os

ROOT = os.path.join(os.path.dirname(__file__), '..')

def deep_merge(dst, src):
    for k, v in src.items():
        if isinstance(v, dict) and isinstance(dst.get(k), dict):
            deep_merge(dst[k], v)
        else:
            dst[k] = v

def main(en_patch, de_patch):
    for lang, patch in (('en', en_patch), ('de', de_patch)):
        p = os.path.join(ROOT, f'src/i18n/locales/{lang}/translation.json')
        data = json.load(open(p))
        deep_merge(data, patch)
        json.dump(data, open(p, 'w'), ensure_ascii=False, indent=2)
        open(p, 'a').write('\n')

if __name__ == '__main__':
    main(json.loads(sys.argv[1]), json.loads(sys.argv[2]))
