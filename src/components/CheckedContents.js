import { useState, useEffect } from 'react';

const CheckedContents = ({getAgree}) => {

    // 체크된 아이템을 담을 배열
    const [checkedButtons, setCheckedButtons] = useState([]);

    useEffect(() => {
        if (checkedButtons.length >= 2) {
            console.log("전체 동의 완료", checkedButtons);
            getAgree(true);
        } else {
            console.log("전체 동의 안됨", checkedButtons);
            getAgree(false);
        }
    })

    // 체크박스 단일 선택
    const changeHandler = (checked, id) => {
        if (checked) {
          setCheckedButtons([...checkedButtons, id]);
          console.log('체크 반영 완료');
        } else {
          setCheckedButtons(checkedButtons.filter(button => button !== id));
          console.log('체크 해제 반영 완료');
        }
    };

    const onChangeAll = (checked, id) => {
        if (checked) {
            setCheckedButtons(checked ? [...checkedButtons, 'check1', 'check2']: [])
            getAgree(true);
            console.log('전체 체크 완료');
        } else {
            setCheckedButtons([]);
            getAgree(false);
            console.log('전체 체크 해제');
        }
    }

    return (
        <>
            <div className="content-title-inner">
            <label id="allCheck" htmlFor="allCheck">
                <input
                    type="checkbox"
                    id="allCheck"
                    onChange={e => {
                      onChangeAll(e.currentTarget.checked);
                    }}
                    checked={checkedButtons.length >= 2 ? true : false}
                ></input> {' '}
                전체 동의
            </label>
            </div>

            <div className="content-label-inner">
            <input
                type="checkbox"
                id="check1"
                onChange={e => {
                  changeHandler(e.currentTarget.checked, 'check1');
                }}
                checked={checkedButtons.includes('check1') ? true : false}
            ></input> {' '}
            <label id="check1" htmlFor="check1"></label>
            <span>{' '}구매조건 확인 및 결제 진행 동의</span>
            </div>

            <div className="content-label-inner">
            <input
                type="checkbox"
                id="check2"
                onChange={e => {
                  changeHandler(e.currentTarget.checked, 'check2');
                }}
                checked={checkedButtons.includes('check2') ? true : false}
            ></input> {' '}
            <label id="check2" htmlFor="check2"></label>
            <span>{' '}개인정보 제3자 제공 동의</span>
            </div>
        </>
    );
}

export default CheckedContents;
