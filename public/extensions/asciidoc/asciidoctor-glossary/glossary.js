

const $glossaryContexts = Symbol('$glossaryContexts')

module.exports.register = (registry, config = {}) => {
  // For a per-page extension in Antora, config will have the structure:
  //{ file, // the vfs file being processed
  // contentCatalog, // the Antora content catalog
  // config // the asciidoc section of the playbook, enhanced with asciidoc attributes from the component descriptor.
  // }

  // For "required" global extensions in Antora, config will be undefined (replaced with {}).
  // Other loading code may use other config options.

  //File access

  const vfs = adaptVfs()

  function adaptVfs () {
    function getKey (src) {
      return `${src.version}@${src.component}`
    }

    if (config.vfs && typeof config.vfs.getConfig === 'function') {
      return config.vfs
    }if (config.file && config.contentCatalog && typeof config.contentCatalog.resolveResource === 'function') {
      //Antora support
      const contentCatalog = config.contentCatalog
      if (!contentCatalog[$glossaryContexts]) contentCatalog[$glossaryContexts] = {}
      const glossaryContexts = contentCatalog[$glossaryContexts]
      const key = getKey(config.file.src)
      if (!glossaryContexts[key]) {
        glossaryContexts[key] = {
          gloss: [],
          self: undefined,
          dlist: undefined,
        }
      }
      const context = glossaryContexts[key]
      return {
        getContext: () => context,
      }
    }
      const context = {
        gloss: [],
        self: undefined,
        dlist: undefined,
      }
      return {
        getContext: () => context,
      }
  }
  //characters to replace by '_' in generated idprefix
  const IDRX = /[/ _.-]+/g

  function termId (term) {
    return `_glossterm_${term.toLowerCase().replace(IDRX, '_')}`
  }

  function dlistItem (context, term, def) {
    const id = termId(term)
    const termWithAnchor = `anchor:${id}[${term}]${term}`
    const termItem = context.self.createListItem(context.dlist, termWithAnchor)
    const defItem = context.self.createListItem(context.dlist, def)
    return [[termItem], defItem]
  }

  function glossaryBlockMacro () {
    return function () {
      this.named('glossary')
      this.$option('format', 'short') //no target between glossary:: and [params]
      // self.positionalAttributes(['name', 'parameters'])
      this.process((parent, target, attributes) => {
        const context = vfs.getContext()
        const dlist = this.createList(parent, 'dlist')
        context.self = this
        context.dlist = dlist
        for (const { term, def } of context.gloss) {
          dlist.blocks.push(dlistItem(context, term, def))
        }
        return dlist
      })
    }
  }

  const TRX = /(<[a-z]+)([^>]*>.*)/

  function glossaryInlineMacro () {
    return function () {
      this.named('glossterm')
      //Specifying the regexp allows spaces in the term.
      this.$option('regexp', /glossterm:([^[]+)\[(|.*?[^\\])\]/)
      this.positionalAttributes(['definition'])
      this.process((parent, target, attributes) => {
        const term = attributes.term || target
        const document = parent.document
        const context = vfs.getContext()
        let tooltip = document.getAttribute('glossary-tooltip')
        if (tooltip === 'true') tooltip = 'data-glossary-tooltip'
        if (tooltip && tooltip !== 'title' && !tooltip.startsWith('data-')) {
          console.log(`glossary-tooltip attribute '${tooltip}' must be 'true', 'title', or start with 'data-`)
          tooltip = undefined
        }
        const logTerms = document.hasAttribute('glossary-log-terms')
        let definition = attributes.definition
        if (definition) {
          logTerms && console.log(`${term}::  ${definition}`)
          addItem(context, term, definition)
        } else if (tooltip) {
          const index = context.gloss.findIndex((candidate) => candidate.term === term)
          definition = ~index ? context.gloss[index].def : `${term} not yet defined`
        }
        const links = document.getAttribute('glossary-links', 'true') === 'true'
        let glossaryPage = document.getAttribute('glossary-page', '')
        if (glossaryPage.endsWith('.adoc')) {
          glossaryPage = `${glossaryPage.slice(0, -5)}.html`
        }
        const glossaryTermRole = document.getAttribute('glossary-term-role', 'glossary-term')
        const attrs = glossaryTermRole ? { role: glossaryTermRole } : {}
        const inline = links
          ? this.createInline(parent, 'anchor', target, { type: 'xref', target: `${glossaryPage}#${termId(term)}`, reftext: target, attributes: attrs })
          : this.createInline(parent, 'quoted', target, { attributes: attrs })
        if (tooltip) {
          const a = inline.convert()
          const matches = a.match(TRX)
          if (matches) {
            return this.createInline(parent, 'quoted', `${matches[1]} ${tooltip}="${definition}"${matches[2]}`)
          }
            return this.createInline(parent, 'quoted', `<span ${tooltip}="${definition}">${a}</span>`)
        }
        return inline
      })
    }
  }

  function addItem (context, term, def) {
    let i = 0
    let comp = -1
    for (; i < context.gloss.length; i++) {
      comp = term.localeCompare(context.gloss[i].term)
      if (comp <= 0) break
    }
    if (comp < 0) {
      context.gloss.splice(i, 0, { term, def })
      if (context.self && context.dlist) {
        context.dlist.blocks.splice(i, 0, dlistItem(context, term, def))
      }
    } else {
      console.log(`duplicate glossary term ${term}`)
    }
  }

  function doRegister (registry) {
    if (typeof registry.blockMacro === 'function') {
      registry.blockMacro(glossaryBlockMacro())
    } else {
      console.warn('no \'blockMacro\' method on alleged registry')
    }
    if (typeof registry.inlineMacro === 'function') {
      registry.inlineMacro(glossaryInlineMacro())
    } else {
      console.warn('no \'inlineMacro\' method on alleged registry')
    }
  }

  if (typeof registry.register === 'function') {
    registry.register(function () {
      doRegister(this)
    })
  } else {
    doRegister(registry)
  }
  return registry
}
