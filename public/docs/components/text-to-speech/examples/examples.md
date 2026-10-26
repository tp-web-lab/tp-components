::::::: tp-markdown-viewer { label="tp-text-to-speech" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-text-to-speech { lang="en-GB" show-text }
::: script { type="tp/txt" }
Welcome to tp-components. This example uses the browser speech synthesis service.
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- autoplay

- lite

- show-text
:::

::: tp-radio-list { data-setting="src" label="src" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

:::: tp-cluster
::: tp-textfield { data-setting="for" label="for" value placeholder clearable }
:::

::: tp-textfield { data-setting="legend" label="legend" value="Text to speech" placeholder="Text to speech" clearable }
:::

::: tp-textfield { data-setting="pause-between-lines" label="pause-between-lines" value="0" placeholder="0" clearable }
:::

::: tp-textfield { data-setting="pitch" label="pitch" value="1" placeholder="1" clearable }
:::

::: tp-textfield { data-setting="rate" label="rate" value="1" placeholder="1" clearable }
:::

::: tp-textfield { data-setting="value" label="value" value placeholder clearable }
:::

::: tp-textfield { data-setting="voice" label="voice" value placeholder clearable }
:::

::: tp-textfield { data-setting="volume" label="volume" value="1" placeholder="1" clearable }
:::
::::

:::: tp-button-group
::: tp-button { id="attributes-reset" type="button" }
Reset defaults
:::

::: tp-button { id="attributes-reload" type="button" }
Reload preview
:::
::::
:::::

::: tp-divider
:::

### Preview

::: tp-iframe { id="attributes-frame" title="text-to-speech attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

::: script { type="module" src="/docs/components/text-to-speech/examples/attributes.js" }
:::
```

``` example {label="English voices"}
::: tp-text-to-speech { id="voice-comparison" value="Welcome to tp-components. You can pause this reading and resume it whenever you want." lang="en-US" show-text }
:::
::: script { type="module" src="/docs/components/text-to-speech/examples/voice-comparison.js" }
:::
```

``` example {label="French voices"}
::: tp-text-to-speech { id="voice-comparison" value="Bienvenue dans tp-components. Vous pouvez mettre cette lecture en pause, puis la reprendre à votre rythme." lang="fr-FR" show-text }
:::
::: script { type="module" src="/docs/components/text-to-speech/examples/voice-comparison.js" }
:::
```

``` example {label="Synchronized speech"}
Press Speak, then try Pause, Resume and Stop. Some voices do not report word boundaries; the full text remains visible in that case.

::: tp-typewriting { id="spoken-text" word }
Welcome to **tp-components**. You can pause this reading and resume it whenever you want.
:::

::: tp-text-to-speech { for="spoken-text" lang="en" }
:::
```

``` example {label="Read an element"}
::: article { id="reading-article" }
Welcome to **tp-components**. This article stays visible while it is read aloud.

You can pause the reading, resume it, or stop it whenever you want.
:::

::: tp-text-to-speech { for="reading-article" lang="en" }
:::
```

``` example {label="Pauses"}
:::: tp-text-to-speech { lang="en-GB" show-text pause-between-lines="800" }
::: script { type="tp/txt" }
Look at the illustration. [pause=1500]
A. A woman is placing [pause=300] a box on a table.
B. Two people are boarding a train.
C. A man is cleaning a window.
D. Some chairs are being stacked.
:::
::::
```

``` example {label="Dialogue"}
Voice names depend on your browser and system. This dialogue uses Daniel and Kate when available; otherwise it uses the component voice. Open Speech voice settings to see the available names for this language.

:::: tp-text-to-speech { lang="en-GB" show-text pause-between-lines="400" }
::: script { type="tp/txt" }
[voice=Daniel] Hello! How are you?
[voice=Kate] Very well, thank you. [pause=600]
[voice=Daniel] Shall we begin?
[voice=default] End of the dialogue.
:::
::::
```
::::::
:::::::
