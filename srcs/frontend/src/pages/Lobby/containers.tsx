import styled from 'styled-components';

interface ContainerProps {
  settings: boolean;
}

export const Container = styled.div`
background-color: #fff;
border-radius: 10px;
box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
position: relative;
overflow: hidden;
width: 678px;
max-width: 100%;
min-height: 400px;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`;

export const OnlineContainer = styled.div<ContainerProps>`
 position: absolute;
 top: 0;
 height: 100%;
 transition: all 0.3s ease-in-out;
 left: 0;
 width: 50%;
 opacity: 0;
 z-index: 1;
 ${props => props.settings !== true ? `
   transform: translateX(100%);
   opacity: 1;
   z-index: 5;
 ` 
 : null}
`;


export const OfflineContainer = styled.div<ContainerProps>`
position: absolute;

height: 100%;
transition: all 0.3s ease-in-out;
left: 0;
width: 50%;
z-index: 2;
${props => (props.settings !== true ? `transform: translateX(100%);` : null)}
`;

export const TopCard = styled.div`
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding: 20px;
    margin: 10px;
    background-color: white;
    border-radius: 10px;
    width: 170px;
    height: 150px;
    transition: transform 0.3s; /* Yeni satır */

    &:hover {
      transform: scale(1.1);
    }
`

export const BottomCard = styled.div`
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding: 20px;
    margin: 10px;
    background-color: white;
    border-radius: 10px;
    width: 170px;
    height: 150px;
    transition: transform 0.3s; /* Yeni satır */

    &:hover {
      transform: scale(1.1);
    }
`

export const Card = styled.form`
  background-color: rgba(88, 110, 124, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
  position: relative;

  .games1, .games2 {
    color: #000000;
    text-decoration: none;
    font-family: Arial, sans-serif;
    font-size: 16px;
    margin-bottom:10px;
  }

  .img1 {
    width: 100px;
    height: 94px;
  }

  .img2 {
    width: 100px;
    height: 90px;
  }

  .game-container1, .game-container2 {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding: 20px;
    margin: 10px;
    background-color: white;
    border-radius: 10px;
    width: 170px;
    height: 150px;
    transition: transform 0.3s; /* Yeni satır */

    &:hover {
      transform: scale(1.1);
    }
  }

  .mylink1, .mylink2, .flap {
   border-radius: 20px;
   border: 1px solid rgb(88, 110, 124);
   background-color: rgb(88, 110, 124, 0.5);
   color: #ffffff;
   font-size: 15px;
   font-weight: bold;
   padding: 12px 45px;
   letter-spacing: 1px;
   text-transform: uppercase;
   transition: transform 80ms ease-in;
   margin: 10px;
   z-index: 300;
   text-decoration: none;
   width: 230px;

   &:hover {
    transform: scale(1.1);
    }
  }

  // .flap {
  //   position: absolute;
  // }

  .box {
    // border-radius: 20px;
    // border: 1px solid rgb(88, 110, 124);
    background-color: rgb(88, 110, 124, 0.5);
    color: #ffffff;
    font-size: 14px;
    // font-weight: bold;
    padding: 8px 8px;
    letter-spacing: 1px;
    // text-transform: uppercase;
    // transition: transform 80ms ease-in;
    margin: 10px;
    z-index: 300;
    }

    .add {
      border-radius: 20px;
      color: #ffffff;
      padding: 4px 4px;
      transition: transform 80ms ease-in;
      margin: 10px;
      z-index: 300;
    }

    .close {
      border: none;
    }

      .popup {
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        padding: 20px;
        margin: 10px;
        background-color: rgba(88, 110, 124, 0.1);
        border-radius: 10px;
        width: 270px;
        height: 70px;
        transition: transform 0.3s;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        &:hover {
          transform: scale(1.1);
        }
      }

      
`;

export const Title = styled.h1`
font-weight: bold;
margin: 0;
`;

export const Input = styled.input`
background-color: #eee;
border: none;
padding: 12px 15px;
margin: 8px 0;
width: 100%;
`;

export const Button = styled.button`
   border-radius: 20px;
   border: 1px solid rgb(88, 110, 124);
   background-color: rgb(88, 110, 124, 0.5);
   color: #ffffff;
   font-size: 12px;
   font-weight: bold;
   padding: 12px 45px;
   letter-spacing: 1px;
   text-transform: uppercase;
   transition: transform 80ms ease-in;
   margin: 10px;
   z-index: 300;

   &:hover {
    transform: scale(1.1);
  }
`;
export const GhostButton = styled(Button)`
background-color: transparent;
border-color: #ffffff;
`;

export const Anchor = styled.a`
color: #333;
font-size: 14px;
text-decoration: none;
margin: 15px 0;
`;
export const OverlayContainer = styled.div<ContainerProps>`
position: absolute;
top: 0;
left: 50%;
width: 50%;
height: 100%;
overflow: hidden;
transition: transform 0.3s ease-in-out;
z-index: 100;
${props =>
 props.settings !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div<ContainerProps>`
background:  rgb(88, 110, 124);
background: -webkit-linear-gradient(to right, rgb(88, 110, 124, 0.1),  rgb(88, 110, 124));
background: linear-gradient(to right, rgb(88, 110, 124, 0.1),  rgb(88, 110, 124));
background-repeat: no-repeat;
background-size: cover;
background-position: 0 0;
color: #ffffff;
position: relative;
left: -100%;
height: 100%;
width: 200%;
transform: translateX(0);
transition: transform 0.3s ease-in-out;
${props => (props.settings !== true ? `transform: translateX(50%);` : null)}
`;

export const OverlayPanel = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.3s ease-in-out;
`;

export const LeftOverlayPanel = styled(OverlayPanel)<ContainerProps>`
  transform: translateX(-20%);
  ${props => props.settings !== true ? `transform: translateX(0);` : null}
`;

export const RightOverlayPanel = styled(OverlayPanel)<ContainerProps>`
    right: 0;
    transform: translateX(0);
    ${props => props.settings !== true ? `transform: translateX(20%);` : null}
`;
