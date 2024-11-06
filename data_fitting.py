import pandas as pd
import numpy as np
from numpy.linalg import lstsq
import matplotlib.pyplot as plt
import sys
import math


def fit_data():


    args = sys.argv[1:]
    encoder_1_resolution = int(args[0])
    rated_motor_torque_mNm = int(args[1])
    ref_torque_sensor_type = int(args[2])
    max_torque_mNm = float(args[3])
    motorRevolution = int(args[4])
    gearRevolution = int(args[5])
    gear_ratio = motorRevolution / gearRevolution

    # Read the CSV file
    df = pd.read_csv('data_recording_for_torque_estimation.csv')

    # Extract input columns (1 -> 4 columns)
    encoder_1_ticks = df.iloc[:, 1].values

    motor_speed = df.iloc[:, 2].values
    torque_actual_value_mNm = (df.iloc[:, 3].values * rated_motor_torque_mNm / 1000)
    torsion = df.iloc[:, 5].values

    # Sign of Speed
    sign_of_speed = motor_speed
    sign_of_speed = np.where((sign_of_speed.all() >= -1000 & sign_of_speed.all() <= 1000), sign_of_speed, sign_of_speed/1000)
    sign_of_speed[sign_of_speed > 1000] = 1
    sign_of_speed[sign_of_speed < -1000] = -1

    offset = np.ones((torsion.shape[0], ))
    # Add a column of ones to X to account for the intercept term
    X = np.transpose(np.vstack([torsion, offset, motor_speed, sign_of_speed, torque_actual_value_mNm]))

    # Extract the target column (5th column) refrence torque sensor
    if ref_torque_sensor_type == 1:
        y = df.iloc[:, 4].values
    elif ref_torque_sensor_type == 2:
        encoder_1_ticks = encoder_1_ticks - encoder_1_ticks[0];
        encoder_1_rad = np.mod(encoder_1_ticks, encoder_1_resolution) * 2 * np.pi / encoder_1_resolution
        y = max_torque_mNm * np.sin(encoder_1_rad)

    # Perform least squares fitting
    coefficients, residuals, rank, s = lstsq(X, y, rcond=None)

    # Write the coefficients to a CSV file
    coefficients_df = pd.DataFrame(coefficients, columns=['Coefficients'])
    coefficients_df.to_csv('coefficients.csv', index=False)

    estimated_torque_mNm = np.dot(X, coefficients)

    plt.figure(figsize=(15, 15))

    plt.plot(estimated_torque_mNm, label='Estimated_torque')
    plt.plot(y, label='Reference_torque', color='red')
    plt.title('Reference Torque vs Estimated Torque')
    plt.xlabel('No. of points')
    plt.ylabel('Torque (mNm)')
    plt.legend()
    plt.grid(which='both')

    plt.savefig('Reference_torque_vs_estimated_torque.png')

    return

if __name__ == "__main__":

    fit_data()
