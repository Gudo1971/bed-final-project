import  axios from "axios";

export  async function getReviewsByPropertyId(propertyId) {
    const response  = await axios.get(`http://localhost:3000/reviews/${propertyId}/reviews`);
    return response.data;
}