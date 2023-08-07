import { request } from "./api.js"
import Editor from "./Editor.js"
import { getItem, setItem } from "./storage.js"

export default function PostEditPage({ $target, initialState }) {
	const $page = document.createElement("div")

    this.state = initialState

	const TEMP_SAVE_POST_KEY = "temp-post-${this.state.postId}"

	const post = getItem(TEMP_SAVE_POST_KEY, {
		title: '',
		content: ''
	})

	console.log(post)

	let timer = null

	const editor = new Editor({
		$target: $page,
		initialState: post,
		onEditing: (post) => {
			if (timer !== null) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				setItem(TEMP_SAVE_POST_KEY, {
					...post,
					tempSaveData: new Date()
				})
			}, 1000)
		}
    })

    this.setState = async nextState => {
        console.log(this.state.postId, nextState.postId)
        if (this.state.postId !== nextState.postId) {
            this.state = nextState
            await fetchPost()
            return
        }
        this.state = nextState
        this.render()

        editor.setState(this.state.post)
    }
    
    this.render = () => {
        $target.appendChild($page)
    }

    const fetchPost = async () => {
        const { postId } = this.state

        if (postId !== 'new') {
            const post = await request(`/posts/${postId}`)
            
            this.setState({
                ...this.state,
                post
            })
        }
    }
}
