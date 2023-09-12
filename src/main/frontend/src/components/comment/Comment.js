import CommentForm from "./CommentForm";
import {useRef, useState, useEffect} from "react";
import CommentList from "./CommentList";
import CommentEdit from "./CommentEdit";
import ReplyForm from "./ReplyForm";
import axios from "axios";

const Comment = () => {
    const accessToken = localStorage.getItem('accessToken');

    const [userNickname, setUserNickname] = useState("");

    useEffect(() => {
              // 사용자 아이디를 서버로 전송
              axios
                .get("http://localhost:8080/member/find-nickname", {
                withCredentials: true,
                headers: {
                     'Authorization': `Bearer ${accessToken}`
                }
                })

                .then((response) => {
                  // 서버에서 회원 객체를 받아와 닉네임 저장
                  const member = response.data;
                  setUserNickname(member.nickname);

                })
                .catch((error) => {
                  console.error("서버에서 닉네임을 가져오는 중 에러 발생:", error);
                });
    }, []);
    console.log("닉네임가져온거: ", userNickname);

    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState(null); // 수정 중인 댓글 상태 추가

    //댓글에 답글을 작성하는 중인지 여부와 어떤 댓글에 답글을 작성하는지를 추적하는 상태
    const [replyingTo, setReplyingTo] = useState({ commentId: null, author: null });
    const [replies, setReplies] = useState([]); // replies 배열 초기화

    const nextId = useRef(1);

    const setRepliesFun = (replies) => {
        setReplies(replies);
    }
    const addComment = (newComment, commentType) => {
        const commentWithInfo = {
            id: nextId.current++,
            content: newComment,
            author: userNickname,
            created_at: new Date().toLocaleString(),
            isEditing:false,
        }
        let url;
            if (commentType === 'post') {
                url = '/api/comments/post';
            } else if (commentType === 'study') {
                url = '/api/comments/study';
            } else {
                // 다른 종류의 댓글 생성 로직을 추가할 수 있습니다.
            }

            // 서버에 댓글 추가 요청을 보냅니다.
            axios
                .post(url, commentWithInfo)
                .then((response) => {
                    // 서버로부터 받은 응답에서 새로 등록된 댓글 정보를 가져옵니다.
                    const newCommentData = response.data;

                    // 댓글 목록을 업데이트합니다.
                    setComments([...comments, newCommentData]);
                })
                .catch((error) => {
                    console.error("댓글 추가 중 에러 발생:", error);
                });
    };

    const handleEditClick = (index) => {
        const updatedComments = [...comments];
        updatedComments[index].isEditing = !updatedComments[index].isEditing;
        setEditingComment(updatedComments[index].isEditing ? updatedComments[index] : null);
        setComments(updatedComments);
    };

    const handleCommentSave = (editedComment, index) => {
        // 수정한 댓글 저장
        const updatedComments = comments.map((c) =>
            c.id === editedComment.id ? editedComment : c
        );
        setComments(updatedComments);
        setEditingComment(null);
    };

    const handleRemoveClick = (id) => {
        const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
        if (confirmDelete) {
            const updatedComment = comments.filter(comment => comment.id !== id);
            setComments(updatedComment);
        }
    }

    const handleReplyClick = (commentId, author) => {
        setReplyingTo({ commentId, author });
    };

    const handleCancelReply = () => {
        // 답글 작성 모드를 종료합니다.
        setReplyingTo({ commentId: null, author: null });
    };

    const handleReplySubmit = (commentId, replyContent) => {
        // commentId는 어떤 댓글에 대한 답글인지를 식별하는 데 사용합니다.
        // replyContent는 답글 내용입니다.

        // 여기에서 부모 컴포넌트로 답글을 전달하는 로직을 구현합니다.
        // 예를 들어, comments 배열을 업데이트하고 setComments를 호출하여 답글을 추가할 수 있습니다.
        // 답글 정보를 생성하고 comments 배열에 추가하는 방법은 이전에 구현한 addComment와 유사할 것입니다.

        const newReply = {
            id: nextId.current++, // 다음 ID 부여
            content: replyContent,
            author: userNickname, // 작성자 이름 또는 정보 설정
            created_at: new Date().toLocaleString(),
            isEditing: false,
        };

        // 댓글 목록에 답글을 추가합니다.
        const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
                if (!comment.replies) {
                    comment.replies = []; // replies 배열 초기화
                }
                comment.replies.push(newReply);
            }
            return comment;
        });

        // 상태를 업데이트합니다.
        setComments(updatedComments);
    };

    return (
        <div className="comment_form">
            <div>
                <h2>댓글</h2>
                <CommentForm addComment={addComment}/>
                <CommentList
                    comments={comments}
                    setRepliesFun={setRepliesFun}
                    onEditClick={handleEditClick}
                    onRemoveClick={handleRemoveClick}
                    onReplyClick={handleReplyClick}
                    onReplySubmit={handleReplySubmit}
                />
            </div>
            {editingComment && (
                <CommentEdit
                    comment={editingComment}
                    onCancel={() => setEditingComment(null)}
                    onSave={handleCommentSave}
                />
            )}
        </div>
    );
}
export default Comment;