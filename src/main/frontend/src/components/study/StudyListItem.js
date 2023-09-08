import LikeButton from "../repeat_etc/LikeButton";
import ScrapButton from "../repeat_etc/ScrapButton";
import {Link} from "react-router-dom";
import React from "react";

const StudyListItem = ({studies, toggleLike, toggleScrap, d, index}) => {
    return (
        <div className="list" key={d.id}>
            <div className="list_header">
                <div className="list_sub_header">
                    <div className="list_day">
                        {d.id}일간의 우주여행
                    </div>
                    <div className="list_status">진행중</div>
                </div>
                <div className="list_btn">
                    <div className="list_like">
                        <LikeButton like={studies[index].like}
                                    onClick={() => toggleLike(index)}/>
                    </div>
                    <div className="list_scrap">
                        {/* 스크랩 버튼을 클릭하면 해당 스터디 리스트 항목의 스크랩 상태를 토글 */}
                        <ScrapButton scrap={studies[index].scrap}
                                     onClick={() => toggleScrap(index)}/>
                    </div>
                </div>
            </div>
            <Link
                to={`/studydetail/${d.id}`}
                style={{
                    textDecoration: "none",
                    color: "inherit",
                }}
            >
                <div className="list_deadline">
                    마감일 | {d.deadline}
                </div>
                <div className="list_title">{d.title}</div>
                <div className="list_tag">{d.field}</div>
                <div className="list_onoff">{d.onoff}</div>
                <div className="stroke"></div>
                <div className="list_founder">{d.author}</div>
            </Link>
        </div>
    )
}
export default StudyListItem;