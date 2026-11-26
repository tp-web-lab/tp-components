# Trace engine provenance

Source: https://github.com/sineagles/OnlinePythonTutor/tree/526266872a2dc8af671eacd9cb853e08b5bb9fa9/v5-unity
Revision: `526266872a2dc8af671eacd9cb853e08b5bb9fa9` (2019-11-24).
Files: `pg_logger.py`, `pg_encoder.py`. Copyright Philip J. Guo; upstream LICENSE.txt retained.

Adaptation: remove the Python 3.12-incompatible `imp` import and replace `imp.new_module` with `types.ModuleType`.
The local execution entry point is used inside a disposable Pyodide Worker, without OS resource limits. The parent terminates timed-out Workers. This is not a hardened sandbox for hostile programs.
The original visualizer, HTML pages, analytics and server are not distributed or used. The local UI renders the JSON trace with TP controls.

Finite floating-point values retain their full Python precision rather than the upstream four-decimal rounding. Integral floats (including negative zero) retain their Python representation through SPECIAL_FLOAT.
