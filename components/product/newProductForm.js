import { useRef, useEffect, useState } from 'react';
import classes from './newProductForm.module.css';
import { useRouter } from 'next/router';

const category = ["카테고리","인기매물","디지털기기","생활가전","가구","유아동","의류","뷰티","스포츠","취미", "도서", "티켓/교환권", "반려동물용품" , "식물" , "삽니다"];


function NewProductForm() {

  const router = useRouter();

  const categoryRef = useRef();
  const titleInputRef = useRef();
  const priceInputRef = useRef();
  const imgInputRef = useRef();
  const descriptionInputRef = useRef();

  //글쓴이 주소 가져오는 코드
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [dong, setDong] = useState();
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    })

    if (latitude && longitude) {
      // 카카오 지도 API에서 위도, 경도를 주소로 변환
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(longitude, latitude, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            // 변환된 주소에서 동 정보 추출
            for (let i = 0; i < result[0].address.address_name.split(' ').length; i++) {
              if (result[0].address.address_name.split(' ')[i].endsWith('동')) {
                setDong(result[0].address.address_name.split(' ')[i]);
                break;
              }
            }
          }
        });
      })
    }
  }, [latitude, longitude]);

  const submitHandler = (e) =>{
    e.preventDefault();
    
    const category = categoryRef.current.value;
    const enteredTitle = titleInputRef.current.value;
    const enteredPrice = priceInputRef.current.value;
    const enteredImg = imgInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const now = Date.now();

    const newProduct = {
      title : enteredTitle,
      price : enteredPrice,
      img : enteredImg,
      description : enteredDescription,
      time : now,
      Latitude : latitude,
      Longitude : longitude,
      dong : dong,
      category : category
    }

    if(category == "카테고리"){
      alert("카테고리를 골라주세요");
      return 
    }

    fetch(`https://carrot-621db-default-rtdb.firebaseio.com/products/${category}.json`,{
      method:"POST",
      body:JSON.stringify(newProduct),
      headers:{
        "Content-Type":"application.json"
      }
    })

    router.push("/Home")
  }

  const cancelHandler = () =>{
    router.push("/Home") 
  }

  return (
    <form id='form' className={classes.form} onSubmit={submitHandler}>
      <p>
        <select ref={categoryRef}>
          {
            category.map((category,idx)=>{
              return <option key={idx} value={category}> {category} </option>
            })
          }
        </select>
        <label htmlFor="title">제목</label>
        <input
          ref={titleInputRef}
          id="title"
          type="text"
          name="title"
          required
        />
      </p>
      <p>
        <label htmlFor="price">가격</label>
        <input
          ref={priceInputRef}
          id="price"
          type="number"
          name="price"
          required
        />
      </p>
      <p>
        <label htmlFor="image">이미지</label>
        <input
          ref={imgInputRef}
          id="image"
          type="url"
          name="image"
          required
        />
      </p>
      <p>
        <label htmlFor="description">설명</label>
        <textarea
          ref={descriptionInputRef}
          id="description"
          name="description"
          rows="5"
          required
        />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={()=> router.push("/Home")}>
          Cancel
        </button>
        <button>글쓰기</button>
      </div>
    </form>
  );
}

export default NewProductForm;