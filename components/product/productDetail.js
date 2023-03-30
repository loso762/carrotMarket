import classes from './ProductDetail.module.css';

function ProductDetail({ProductData,section}) {
  return (
    <section className={classes.detail}>
      <img
        src={ProductData.img}
        alt={ProductData.title}
      />
      <h1>{ProductData.title}</h1>
      <p>{section}</p>
      <p>{ProductData.price}</p>
      <p>{ProductData.time}</p>
      <p>{ProductData.description}</p>
    </section>
  );
}

export default ProductDetail;
