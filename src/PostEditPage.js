import { request } from "./api.js"
import Editor from "./Editor.js"
import { getItem, setItem } from "./storage.js"

export default function PostEditPage({ $target, initialState }) {
	const $page = document.createElement("div")

    this.state = initialState

	let postLocalSaveKey = `temp-post-${this.state.postId}`

	const post = getItem(postLocalSaveKey, {
		title: '',
		content: ''
	})

	let timer = null

	const editor = new Editor({
		$target: $page,
		initialState: post,
		onEditing: (post) => {
			if (timer !== null) {
				clearTimeout(timer)
			}
			timer = setTimeout(async() => {
				setItem(postLocalSaveKey, {
					...post,
					tempSaveData: new Date()
                })
                
                const isNew = this.state.postId === 'new'
                if (isNew) {
                    const createdPost = await request('/posts/', {
                        method: 'POST',
                        body: JSON.stringify(this.state)
                    })
                    history.replaceState(null, null, `/posts/${createdPost.id}`)
                    removeItem(postLocalSaveKey)
                } else {
                    
                }
			}, 1000)
		}
    })

    this.setState = async nextState => {
        if (this.state.postId !== nextState.postId) {
            postLocalSaveKey = `temp-post-${nextState.postId}`

            this.state = nextState
            await fetchPost()
            return
        }
        this.state = nextState
        this.render()

        editor.setState(this.state.post || {
            title: '',
            content: ''
        })
    }
    
    this.render = () => {
        $target.appendChild($page)
    }

    const fetchPost = async () => {
        const { postId } = this.state

        if (postId !== 'new') {
            const post = await request(`/posts/${postId}`)
            
            const tempPost = getItem(postLocalSaveKey, {
                title: '',
                content: ''
            })

            if (tempPost.tempSaveData && tempPost.tempSaveData > post.updated_at) {
                if (confirm('저장되지 않은 임시 데이터가 있습니다. 불러올까요?')) {
                    this.setState({
                        ...this.state,
                        post: tempPost
                    })
                    return
                }
            }
            this.setState
        }
    }
}
