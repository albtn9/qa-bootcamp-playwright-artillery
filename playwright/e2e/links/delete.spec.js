import { getUserWithLink } from '../../support/factories/user'
import { test, expect } from '../../support/fixtures'
import { gerarULID } from '../../support/utils'

test.describe('Delete /link/:ID', () => {
    const user = getUserWithLink()
    let token

    test.beforeEach(async ({auth}) => {
        await auth.createUser(user)
        token = await auth.getToken(user)
    })

    test('deve remover um link encurtado', async ({ auth, links }) => {

        const linkId = await links.createAndReturnLinksId(user.link, token)
        const response = await links.removeLink(linkId, token)
        expect(response.status()).toBe(200)

        const body = await response.json()
        expect(body.message).toBe('Link excluído com sucesso')

    })

    test('não deve remover quando o id não existe', async ({ auth, links }) => {

        const linkId = gerarULID()

        const response = await links.removeLink(linkId, token)
        expect(response.status()).toBe(404)

        const body = await response.json()
        expect(body.message).toBe('Link não encontrado')

    })
})