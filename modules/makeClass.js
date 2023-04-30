class ClassMaker {
    static build(_class) {
        let classDefinition = `${_class.name}${_class.extends ? ` extends ${_class.super.name}` : ''}`

        let members = ``
        let membersInitialization = `${_class.extends ? '      super(param)\n' : ''}`
        let getSection = ``
        let setSection = ``
        if(_class.members && _class.members.length > 0) {
            for (let i = 0; i < _class.members.length; i++) {
                const member = _class.members[i];
                members += `    #${member};\n`
                membersInitialization += `      this.#${member} = param.${member};\n`
                getSection += 
`    get ${member}() {
        return this.#${member};
    }\n
`
                setSection +=
`    set ${member}(_${member}) {
        this.#${member} = _${member};
    }\n
`
            }
        }
        let template = `class ${classDefinition} {
    /** Static members section **/

${members}
    constructor(${_class.members && _class.members.length > 0 ? 'param' : ''}) {
${membersInitialization}    }

${getSection}${setSection}    /** Static methods section **/
}`
        console.log(template)
    }
}

// exports.default = ClassMaker;
ClassMaker.build({
    name: 'Test',
    extends: true,
    super: {
        name: 'GrandTest',
        members: [
            'command',
            'callback'
        ]
    },
    members: [
        'language'
    ]
})