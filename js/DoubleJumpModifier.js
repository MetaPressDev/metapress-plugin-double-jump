export default class DoubleJumpModifier {

    name = 'Double Jump Settings'
    id = 'double-jump-settings'

    get settings() {
        let settings = []

        settings.push(
            { type: 'description', name: 'Settings to adjust jump height' },
            { type: 'number', id: 'jumpHeight', name: 'Jump Height', help: 'The height of the jump', placeHolder: '5' },
            { type: 'number', id: 'amountOfDoubleJumps', name: 'Amount of Double Jumps', help: 'The amount of double jumps the player can do', placeHolder: '1' }
        )
        // Done
        return settings
    }
    avatarController = null
    onLoad() {
        this.checkAvatarModifier()
    }

    $onEntityModifierLoad() {
        this.checkAvatarModifier()
    }

    $ai_getKnowledgeBaseEntries = () => {
        return [
            {
                id: `${this.id}:doubleJumpSettings`,
                type: 'info',
                name: 'Double Jump Settings',
                tags: 'double jump, jump, settings, jump height, double jump height, double jump amount, amount of double jumps, double jump settings',
                content: `
                    <p>Double Jump Settings</p>
                    <p>Settings to adjust jump height. This is from an external plugin.</p>
                    <p>Jump Height: The height of the jump</p>
                    <p>Amount of Double Jumps: The amount of double jumps the player can do</p>
                `,
            },
        ]
    }

    checkAvatarModifier() {

        let modifier = metapress.entities.getModifier(metapress.avatar.currentUserEntity.id, 'avatar-controller')

        if (this.avatarController = ! null && this.avatarController == modifier) return
        this.avatarController = modifier
        if (this.avatarController == null) setTimeout(() => this.checkAvatarModifier(), 250)
        if (this.avatarController == null) return;
        if (this.avatarController == undefined) return;
        this.avatarController.entity.avatar_jumpHeight = this.entity.jumpHeight || 5;
        this.avatarController.entity.avatar_amountOfDoubleJumps = this.entity.amountOfDoubleJumps || 1;
    }

    onEntityUpdated() {
        this.checkAvatarModifier()
    }

    isEntitySupported(entity) {
        const entityRenderer = metapress.entities.getOrCreateRenderer(entity)
        if (entityRenderer?.entity?.type == 'region') return { result: true, reason: null }
        else return { result: false, reason: 'Only regions are supported.' }
    }

}
