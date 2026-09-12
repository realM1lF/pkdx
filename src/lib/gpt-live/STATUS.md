# GPT-Live — agent warning (2026-09-12)

**STOP before adding more prompt/tool patches.**

Recent changes (prompt split, `commentary.append`, tool timeouts, nuzlocke-store preload, `where_to_find` ranking, `site_pages`, Versus voice limits) **broke more than they fixed**.

## Current symptom

Whatever the user asks: responses take forever, they must follow up many times, and they get **no spoken answers**. Something is badly broken in the Live / delegation / speech path.

## Required next step

Reproduce and fix the speak/hang regression first. Do not pile on features or prompt tweaks until voice works again.

## User status

Work paused for tonight — no more GPT-Live changes until the regression is understood.
